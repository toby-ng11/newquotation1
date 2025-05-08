<?php
namespace Application\Model;

use Laminas\Db\Adapter\Adapter;
use Laminas\Db\Sql\{Sql, Expression};
use Exception;

use Application\Model\Address;
use Laminas\Db\TableGateway\TableGateway;

class Specifier {
    protected $adapter;
    protected $address;
    protected $specifier;

    public function __construct(
        Adapter $adapter,
        TableGateway $specifier,
        Address $address) {
        $this->adapter = $adapter;
        $this->address = $address;
        $this->specifier = $specifier;
    }

    public function add($data, $architect_id) {
        if (!$data || !$architect_id) {
			return  false;
		}

        $info = [
            'first_name'        => trim($data['specifier_first_name']),
            'last_name'         => trim($data['specifier_last_name']),
            'job_title'         => trim($data['specifier_job_title']),
            'architect_id'      => $architect_id,
            'delete_flag'       => 'N',
            'date_added'        => new Expression('GETDATE()'),
            'added_by'          => $data['owner_id']
        ];

        if(empty($data['specifier_address_id'])) {
            $info['address_id'] = $this->address->addSpecifierAddress($data);
        } else {
            $info['address_id'] = $data['specifier_address_id'];
        }

        try {
            $this->specifier->insert($info);
            $newAdressId = $this->specifier->getLastInsertValue();
            return $newAdressId;
        } catch (Exception $e) {
            error_log("Specifer\add:Database Insert Error: " . $e->getMessage());
            return false;
        }
    }

    public function edit($data, $id) {
        if (!$data || !$id) {
			return  false;
		}

        $info = [
            'first_name'        => trim($data['specifier_first_name']),
            'last_name'         => trim($data['specifier_last_name']),
            'job_title'         => trim($data['specifier_job_title']),
            //'architect_id'      => $architect_id,
            //'delete_flag'       => 'N',
            //'date_added'        => new Expression('GETDATE()'),
            //'added_by'          => $data['owner_id']
        ];

        if(empty($data['specifier_address_id'])) {
            $info['address_id'] = $this->address->addSpecifierAddress($data);
        } else {
            $info['address_id'] = $this->address->edit($data, $data['specifier_address_id']);
        }

        try {
            $this->specifier->update($info, ['specifier_id' => $id]);
            return $id;
        } catch (Exception $e) {
            error_log("Specifer\update:Database Update Error: " . $e->getMessage());
            return false;
        }
    }

    public function delete($id)
    {
        if (!$id) {
            return  false;
        }

        try {
            $this->specifier->update(['delete_flag' => 'Y'], ['specifier_id' => $id]);
            return $id;
        } catch (Exception $e) {
            error_log("Specifier\delete: Database Update Error: " . $e->getMessage());
            return false;
        }
    }

    public function fetchSpecifiersByArchitect($architect_id) {
        if (!$architect_id) {
            return false;
        }

        $sql = new Sql($this->adapter);
        $select = $sql->select('p2q_view_specifier_x_address')
            ->columns(['specifier_id', 'first_name', 'last_name'])
            ->where(['architect_id' => $architect_id]);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        return $result;
    }

    public function fetchSpecifierById($id) {
        $sql = new Sql($this->adapter);

        $select = $sql->select('p2q_view_specifier_x_address')
            ->where(['specifier_id' => $id]);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        return $result->current();
    }
}