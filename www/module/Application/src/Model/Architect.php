<?php

namespace Application\Model;

use Application\Service\UserService;
use Laminas\Db\Adapter\Adapter;
use Laminas\Db\Sql\{Sql, Expression};
use Laminas\Db\TableGateway\TableGateway;
use Psr\Container\ContainerInterface;
use Exception;

class Architect
{
    protected $adapter;
    protected $architect;
    protected $container;

    public function __construct(
        Adapter $adapter,
        TableGateway $architect,
        ContainerInterface $container
    ) {
        $this->adapter = $adapter;
        $this->architect = $architect;
        $this->container = $container;
    }

    public function getProject()
    {
        return $this->container->get(Project::class);
    }

    public function getAddress()
    {
        return $this->container->get(Address::class);
    }

    public function getSpecifier()
    {
        return $this->container->get(Specifier::class);
    }

    public function getUserService()
    {
        return $this->container->get(UserService::class);
    }

    public function add($data)
    {
        if (!$data) {
            return  false;
        }

        $user = $this->getUserService()->getCurrentUser();

        $info = [
            'architect_name'    => trim($data['architect_name']),
            'company_id'        => trim($data['architect_company_id']),
            'architect_type_id' => $data['architect_type_id'] ?? null,
            'class_id'          => trim($data['architect_class_id']),
            'delete_flag'       => 'N',
            'date_added'        => new Expression('GETDATE()')
        ];

        if (empty(trim($data['architect_rep_id']))) {
            $info['architect_rep_id'] = $user['id'];
        } else {
            $info['architect_rep_id'] = trim($data['architect_rep_id']);
        }

        try {
            $this->architect->insert($info);
            $newArchitectId = $this->architect->getLastInsertValue();
            return $newArchitectId;
        } catch (Exception $e) {
            error_log("Architect\add: Database Insert Error: " . $e->getMessage());
            return false;
        }
    }

    public function edit($data, $id)
    {
        if (!$data || !$id) {
            return false;
        }

        $user = $this->getUserService()->getCurrentUser();

        $info = [
            'architect_name'    => trim($data['architect_name']),
            //'company_id'      => $data['architect_company_id'],
            'architect_type_id' => $data['architect_type_id'] ?? null,
            'class_id'          => trim($data['architect_class_id']),
            //'delete_flag'     => 'N',
            //'date_added'      => new Expression('GETDATE()')
        ];

        if (empty(trim($data['architect_rep_id']))) {
            $info['architect_rep_id'] = $user['id'];
        } else {
            $info['architect_rep_id'] = trim($data['architect_rep_id']);
        }

        try {
            $this->architect->update($info, ['architect_id' => $id]);
            return $id;
        } catch (Exception $e) {
            error_log("Architect\update: Database Update Error: " . $e->getMessage());
            return false;
        }
    }

    public function delete($id)
    {
        if (!$id) {
            return false;
        }

        $this->getProject()->clearAddressAndSpecifierByArchitect($id);
        $addresses = $this->getAddress()->fetchAddressesByArchitect($id);
        $specifiers = $this->getSpecifier()->fetchSpecifiersByArchitect($id);

        foreach ($addresses as $a) {
            $this->getAddress()->delete($a['address_id']);
        }

        foreach ($specifiers as $s) {
            $this->getSpecifier()->delete($s['specifier_id']);
        }

        try {
            $this->architect->update(['delete_flag' => 'Y'], ['architect_id' => $id]);
            return $id;
        } catch (Exception $e) {
            error_log("Architect\delete: Database Update Error: " . $e->getMessage());
            return false;
        }
    }

    public function fetchArchitectById($id, $company = DEFAULT_COMPANY)
    {
        $sql = new Sql($this->adapter);

        $select = $sql->select('architect')
            ->where(['company_id' => $company, 'architect_id' => $id, 'delete_flag' => 'N']);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute()->current();
        return $result;
    }

    public function fetchArchitectType()
    {
        $sql = new Sql($this->adapter);

        $select = $sql->select('architect_type')
            ->where(['delete_flag' => 'N'])
            ->order('architect_type_desc ASC');

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        return $result;
    }

    public function fetchArchitectByPattern($admin, $pattern, $user_id, $limit = 10, $company = DEFAULT_COMPANY)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select('architect')  // can use TableGateway instead
            ->where(['company_id' => $company])
            ->where(['delete_flag' => 'N']);

        if (!$admin) {
            $select->where(['architect_rep_id' => $user_id]);
        }

        $select->where->nest()->like('architect_id', $pattern . '%')
            ->or
            ->like('architect_name', $pattern . '%')->unnest();

        $select->limit($limit)->offset(0);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        return $result;
    }

    public function fetchAllTable($admin, $user_id)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select('p2q_view_architect');

        if (!$admin) {
            $select->where(['architect_rep_id' => $user_id]);
        }

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        return $result;
    }

    public function countAllArchitects($admin, $user_id)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('p2q_view_architect')
            ->columns(['total' => new Expression('COUNT(*)')]);

        if (!$admin) {
            $select->where(['architect_rep_id' => $user_id]);
        }

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute()->current();
        return $result['total'] ?? 0;
    }

    public function fetchTopFiveTable($user_id)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select('p2q_view_architect_ranking')
            ->where(['owner_id' => $user_id])
            ->order('total_projects DESC')
            ->limit(5)->offset(0);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        return $result;
    }

    public function fetchProjectsByArchitect($id)
    {
        $sql = new Sql($this->adapter);

        $select = $sql->select('p2q_view_project')
            ->where(['architect_id' => $id]);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        return $result;
    }
}
