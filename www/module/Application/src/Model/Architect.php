<?php

namespace Application\Model;

use Laminas\Db\TableGateway\TableGatewayInterface;
use Laminas\Db\Sql\Select;
use Laminas\Db\Adapter\Adapter;
use Laminas\Db\Sql\{Sql, Expression};
use Exception;

use Application\Model\Address;
use Laminas\Db\TableGateway\TableGateway;

class Architect
{
    protected $adapter;
    protected $address;
    protected $architect;

    public function __construct(
        Adapter $adapter,
        TableGateway $architect,
        Address $address
    ) {
        $this->adapter = $adapter;
        $this->address = $address;
        $this->architect = $architect;
    }

    public function add($data)
    {
        if (!$data) {
            return  false;
        }

        $info = [
            'architect_name' => $data['architect_name'],
            'company_id' => $data['architect_company_id'],
            'architect_rep_id' => $data['architect_rep_id'],
            'architect_type_id' => $data['architect_type_id'],
            'class_id' => $data['architect_class_id'],
            'delete_flag' => 'N',
            'date_added' => new Expression('GETDATE()')
        ];

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

        $info = [
            'architect_name' => $data['architect_name'],
            //'company_id' => $data['architect_company_id'],
            'architect_rep_id' => $data['architect_rep_id'],
            'architect_type_id' => $data['architect_type_id'],
            'class_id' => $data['architect_class_id'],
            //'delete_flag' => 'N',
            //'date_added' => new Expression('GETDATE()')
        ];

        try {
            $this->architect->update($info, ['architect_id' => $id]);
            return $id;
        } catch (Exception $e) {
            error_log("Architect\update: Database Update Error: " . $e->getMessage());
            return false;
        }
    }

    public function fetchArchitectById($id, $company = DEFAULT_COMPANY)
    {
        $sql = new Sql($this->adapter);

        $select = $sql->select('architect')
            ->where(['company_id' => $company, 'architect_id' => $id]);

        $selectString = $sql->buildSqlString($select);
        //error_log($selectString);
        $result = $this->adapter->query($selectString, $this->adapter::QUERY_MODE_EXECUTE);
        return $result->current();
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

    public function fetchArchitectByPattern($pattern, $limit = 10, $company = DEFAULT_COMPANY)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select('architect')  // can use TableGateway instead
            ->where(['company_id' => $company])
            ->where(['delete_flag' => 'N'])
            ->limit($limit);

        $select->where->nest()->like('architect_id', $pattern . '%')
            ->or
            ->like('architect_name', $pattern . '%')->unnest();

        $selectString = $sql->buildSqlString($select);
        //error_log($selectString);
        $result = $this->adapter->query($selectString, $this->adapter::QUERY_MODE_EXECUTE);
        return $result;
    }
}
