<?php

namespace Application\Model;

use Laminas\Db\Sql\Select;
use Laminas\Db\Adapter\Adapter;
use Laminas\Db\Sql\Sql;
use Exception;
use Laminas\Db\TableGateway\TableGateway;

class Address {
    protected $adapter;
    protected $address;

    public function __construct(Adapter $adapter, TableGateway $address) {
        $this->adapter = $adapter;
        $this->address = $address;
    }

    public function add($data) {
        if ($data == null) {
			return  false;
		}

        $info = [
            'name'                  => $data['architect_name'],
            'phys_address1'         => $data['phys_address1'],
            'phys_address2'         => $data['phys_address2'],
            'phys_city'             => $data['phys_city'],
            'phys_state'            => $data['phys_state'],
            'phys_postal_code'      => $data['phys_postal_code'],
            'phys_country'          => $data['phys_country'],
            'central_phone_number'  => $data['central_phone_number'],
            'delete_flag'           => 'N',
            'email_address'         => $data['email_address'],
            'url'                   => $data['url']
        ];

        try {
            $this->address->insert($info);
            $newAdressId = $this->address->getLastInsertValue();
            return $newAdressId;
        } catch (Exception $e) {
            error_log("Address\add: Database Insert Error: " . $e->getMessage());
            return false;
        }
    }

    public function addSpecifierAddress($data) {
        if ($data == null) {
			return  false;
		}

        $info = [
            'name'                  => $data['specifier_first_name'] . ' ' . $data['specifier_last_name'],
            'central_phone_number'  => $data['specifier_phone_number'],
            'delete_flag'           => 'N',
            'email_address'         => $data['specifier_email']
        ];

        try {
            $this->address->insert($info);
            $newAdressId = $this->address->getLastInsertValue();
            return $newAdressId;
        } catch (Exception $e) {
            error_log("Address\addSpecifierAddress:Database Insert Error: " . $e->getMessage());
            return false;
        }
    }
}