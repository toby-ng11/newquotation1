<?php

namespace Application\Model;

use Laminas\Db\TableGateway\TableGatewayInterface;
use Laminas\Db\Sql\Select;
use Laminas\Db\Adapter\Adapter;
use Laminas\Db\Sql\{Sql, Expression};
use Exception;

use Application\Model\Address;
use Laminas\Db\TableGateway\TableGateway;

class Architect {
    protected $adapter;
    protected $address;
    protected $architect;

    public function __construct(
        Adapter $adapter,
        TableGateway $architect,
        Address $address) {
        $this->adapter = $adapter;
        $this->address = $address;
        $this->architect = $architect;
    }

    public function add($data) {
        if ($data == null) {
			return  false;
		}

        $info = [
            'architect_name' => $data['architect_name'],
            'company_id' => $data['architect_company_id'],
            'architect_rep_id' => $data['architect_rep_id'],
            'delete_flag' => 'N',
            'date_added' => new Expression('GETDATE()')
        ];
        
        if(empty($data['address_id'])) {
            $info['address_id'] = $this->address->add($data);
        } else {
            $info['address_id'] = $data['address_id'];
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

    public function fetchArchitectById($id, $company = DEFAULT_COMPANY) {
        $sql = new Sql($this->adapter);

        $select = $sql->select('p2q_view_architect_x_address')
            ->where(['company_id' => $company, 'architect_id' => $id]);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        return $result->current();
    }

    public function fetchArchitectByPattern($pattern, $limit = 10, $company = DEFAULT_COMPANY) {
        $sql = new Sql($this->adapter);
        $select = $sql->select('architect')  // can use TableGateway instead
            ->where(function ($where) use ($pattern) {
                $where->like('architect_id', $pattern . '%')
                    ->or
                    ->like('architect_name', $pattern . '%');
            })
            ->where(['company_id' => $company])
            ->where(['delete_flag' => 'N'])
            ->limit($limit);

        $selectString = $sql->buildSqlString($select);
        $result = $this->adapter->query($selectString, $this->adapter::QUERY_MODE_EXECUTE);
        return $result;
    }
}