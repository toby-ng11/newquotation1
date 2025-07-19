<?php

namespace Application\Model;

use Application\Helper\InputValidator;
use Laminas\Db\Adapter\Adapter;
use Laminas\Db\Sql\Sql;
use Laminas\Db\TableGateway\TableGateway;
use Exception;
use Laminas\Db\Sql\Expression;

class Address
{
    protected $adapter;
    protected $address;

    public function __construct(Adapter $adapter, TableGateway $address)
    {
        $this->adapter = $adapter;
        $this->address = $address;
    }

    public function add($data, $architectID)
    {
        if (! InputValidator::isValidData($data) || ! InputValidator::isValidId($architectID)) {
            return false;
        }

        $info = [
            'architect_id'          => $architectID,
            'name'                  => empty(trim($data['address_name'])) ? trim($data['phys_address1']) : trim($data['address_name']),
            'phys_address1'         => empty(trim($data['phys_address1'])) ? trim($data['address_name']) : trim($data['phys_address1']),
            'phys_address2'         => trim($data['phys_address2']),
            'phys_city'             => trim($data['phys_city']),
            'phys_state'            => trim($data['phys_state']),
            'phys_postal_code'      => trim($data['phys_postal_code']),
            'phys_country'          => trim($data['phys_country']),
            'central_phone_number'  => trim($data['central_phone_number']),
            'delete_flag'           => 'N',
            'email_address'         => trim($data['email_address']),
            'url'                   => trim($data['url']),
            'created_at'            => new Expression('GETDATE()'),
            'updated_at'            => new Expression('GETDATE()'),
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

    public function edit($data, $id)
    {
        if (! InputValidator::isValidData($data) || ! InputValidator::isValidId($id)) {
            return false;
        }

        $info = [
            //'architect_id'          => $architectID,
            'name'                  => empty(trim($data['address_name'])) ? trim($data['phys_address1']) : trim($data['address_name']),
            'phys_address1'         => empty(trim($data['phys_address1'])) ? trim($data['address_name']) : trim($data['phys_address1']),
            'phys_address2'         => trim($data['phys_address2']),
            'phys_city'             => trim($data['phys_city']),
            'phys_state'            => trim($data['phys_state']),
            'phys_postal_code'      => trim($data['phys_postal_code']),
            'phys_country'          => trim($data['phys_country']),
            'central_phone_number'  => $data['central_phone_number'],
            //'delete_flag'           => 'N',
            'email_address'         => trim($data['email_address']),
            'url'                   => trim($data['url']),
            'updated_at'            => new Expression('GETDATE()'),
        ];

        try {
            $this->address->update($info, ['address_id' => $id]);
            return $id;
        } catch (Exception $e) {
            error_log("Address\update: Database Update Error: " . $e->getMessage());
            return false;
        }
    }

    public function delete($id)
    {
        if (! InputValidator::isValidId($id)) {
            return false;
        }

        try {
            $this->address->update([
                'delete_flag' => 'Y',
                'deleted_at' => new Expression('GETDATE()')
            ], ['address_id' => $id]);
            return $id;
        } catch (Exception $e) {
            error_log("Address\delete: Database Update Error: " . $e->getMessage());
            return false;
        }
    }

    public function addSpecifierAddress($data, $specifierID)
    {
        if (! InputValidator::isValidData($data)) {
            return false;
        }

        $info = [
            'specifier_id'          => $specifierID,
            'name'                  => trim($data['specifier_first_name']) . ' ' . trim($data['specifier_last_name']),
            'central_phone_number'  => $data['specifier_phone_number'],
            'delete_flag'           => 'N',
            'email_address'         => trim($data['specifier_email']),
            'created_at'            => new Expression('GETDATE()'),
            'updated_at'            => new Expression('GETDATE()'),
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

    public function editSpecifierAddress($data, $id)
    {
        if (! InputValidator::isValidData($data) || ! InputValidator::isValidId($id)) {
            return false;
        }

        $info = [
            'name'                  => trim($data['specifier_first_name']) . ' ' . trim($data['specifier_last_name']),
            'central_phone_number'  => trim($data['specifier_phone_number']),
            'email_address'         => trim($data['specifier_email']),
            'updated_at'            => new Expression('GETDATE()'),
        ];

        try {
            $this->address->update($info, ['address_id' => $id]);
            return $id;
        } catch (Exception $e) {
            error_log("Address\editSpecifierAddress: Database Update Error: " . $e->getMessage());
            return false;
        }
    }

    public function fetchAddressesByArchitect($id)
    {
        if (! InputValidator::isValidId($id)) {
            return false;
        }

        $sql = new Sql($this->adapter);

        $select = $sql->select('p2q_view_address')
            ->where(['architect_id' => $id]);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        return $result;
    }

    public function findByPhysicalAddressFuzzy($address1, $postalCode)
    {
        if (! InputValidator::isValidData($address1) || ! InputValidator::isValidData($postalCode)) {
            return false;
        }

        $sql = new Sql($this->adapter);

        $select = $sql->select('p2q_view_address');
        $select->where
            ->isNull('deleted_at')
            ->equalTo('phys_postal_code', trim($postalCode));

        $statement = $sql->prepareStatementForSqlObject($select);
        $results = $statement->execute()->current();

        $address1 = strtolower(trim($address1));
        $highestScore = 0;
        $bestMatch = null;

        foreach ($results as $row) {
            $rowAddress1 = strtolower(trim($row['phys_address1']));
            similar_text($address1, $rowAddress1, $percent);

            if ($percent > $highestScore && $percent >= 85) { // threshold can be tuned
                $highestScore = $percent;
                $bestMatch = $row;
            }
        }

        return $bestMatch;
    }

    public function fetchSpecifierAddress($specifier_id)
    {
        if (! InputValidator::isValidId($specifier_id)) {
            return false;
        }

        $sql = new Sql($this->adapter);

        $select = $sql->select('p2q_view_address')
            ->where(['specifier_id' => $specifier_id]);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute()->current();
        return $result;
    }

    public function fetchAddressesById($id)
    {
        if (! InputValidator::isValidId($id)) {
            return false;
        }

        $sql = new Sql($this->adapter);

        $select = $sql->select('p2q_view_address')
            ->where(['address_id' => $id]);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute()->current();
        return $result;
    }
}
