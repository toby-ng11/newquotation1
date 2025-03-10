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
        if ($data == null) {
			return  false;
		}

        $info = [
            'first_name'        => $data['specifier_first_name'],
            'last_name'         => $data['specifier_last_name'],
            'job_title'         => $data['specifier_job_title'],
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
}