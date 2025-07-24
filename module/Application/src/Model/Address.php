<?php

namespace Application\Model;

use Application\Helper\InputValidator;
use Application\Service\UserService;
use Laminas\Db\Adapter\Adapter;
use Laminas\Db\Sql\Sql;
use Laminas\Db\TableGateway\TableGateway;
use Exception;
use Laminas\Db\Sql\Expression;
use Psr\Container\ContainerInterface;

class Address
{
    protected $adapter;
    protected $address;
    protected $container;

    public function __construct(
        Adapter $adapter,
        TableGateway $address,
        ContainerInterface $container
    ) {
        $this->adapter = $adapter;
        $this->address = $address;
        $this->container = $container;
    }

    public function getUserService()
    {
        return $this->container->get(UserService::class);
    }

    public function add($data, $architectID)
    {
        if (! InputValidator::isValidData($data) || ! InputValidator::isValidId($architectID)) {
            return false;
        }

        $user = $this->getUserService()->getCurrentUser();

        $info = [
            'addressable_id'        => $architectID,
            'addressable_type'      => 'App\Models\Architect',
            'name'                  => empty(trim($data['address_name'])) ? trim($data['phys_address1']) : trim($data['address_name']),
            'phys_address1'         => empty(trim($data['phys_address1'])) ? trim($data['address_name']) : trim($data['phys_address1']),
            'phys_address2'         => ! empty(trim($data['phys_address2'])) ? trim($data['phys_address2']) : null,
            'phys_city'             => ! empty(trim($data['phys_city'])) ? trim($data['phys_city']) : null,
            'phys_state'            => ! empty(trim($data['phys_state'])) ? trim($data['phys_state']) : null,
            'phys_postal_code'      => ! empty(trim($data['phys_postal_code'])) ? trim($data['phys_postal_code']) : null,
            'phys_country'          => ! empty(trim($data['phys_country'])) ? trim($data['phys_country']) : null,
            'central_phone_number'  => ! empty(trim($data['central_phone_number'])) ? trim($data['central_phone_number']) : null,
            'email_address'         => ! empty(trim($data['email_address'])) ? trim($data['email_address']) : null,
            'url'                   => ! empty(trim($data['url'])) ? trim($data['url']) : null,
            'created_at'            => new Expression('GETDATE()'),
            'created_by'            => $user['id'],
            'updated_by'            => $user['id'],
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

        $user = $this->getUserService()->getCurrentUser();

        $info = [
            //'architect_id'          => $architectID,
            'name'                  => empty(trim($data['address_name'])) ? trim($data['phys_address1']) : trim($data['address_name']),
            'phys_address1'         => empty(trim($data['phys_address1'])) ? trim($data['address_name']) : trim($data['phys_address1']),
            'phys_address2'         => ! empty(trim($data['phys_address2'])) ? trim($data['phys_address2']) : null,
            'phys_city'             => ! empty(trim($data['phys_city'])) ? trim($data['phys_city']) : null,
            'phys_state'            => ! empty(trim($data['phys_state'])) ? trim($data['phys_state']) : null,
            'phys_postal_code'      => ! empty(trim($data['phys_postal_code'])) ? trim($data['phys_postal_code']) : null,
            'phys_country'          => ! empty(trim($data['phys_country'])) ? trim($data['phys_country']) : null,
            'central_phone_number'  => ! empty(trim($data['central_phone_number'])) ? trim($data['central_phone_number']) : null,
            'email_address'         => ! empty(trim($data['email_address'])) ? trim($data['email_address']) : null,
            'url'                   => ! empty(trim($data['url'])) ? trim($data['url']) : null,
            'updated_at'            => new Expression('GETDATE()'),
            'updated_by'            => $user['id'],
        ];

        try {
            $this->address->update(
                $info,
                [
                    'addressable_id' => $id,
                    'addressable_type' => 'App\Models\Architect',
                ]
            );
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
                'deleted_at' => new Expression('GETDATE()')
            ], ['id' => $id]);
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

        $user = $this->getUserService()->getCurrentUser();

        $info = [
            'addressable_id'        => $specifierID,
            'addressable_type'      => 'App\Models\Specifier',
            'name'                  => trim($data['specifier_first_name']) . ' ' . trim($data['specifier_last_name']),
            'central_phone_number'  => ! empty(trim($data['specifier_phone_number'])) ? trim($data['specifier_phone_number']) : null,
            'email_address'         => ! empty(trim($data['specifier_email'])) ? trim($data['specifier_email']) : null,
            'created_at'            => new Expression('GETDATE()'),
            'created_by'            => $user['id'],
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

        $user = $this->getUserService()->getCurrentUser();

        $info = [
            'name'                  => trim($data['specifier_first_name']) . ' ' . trim($data['specifier_last_name']),
            'central_phone_number'  => ! empty(trim($data['specifier_phone_number'])) ? trim($data['specifier_phone_number']) : null,
            'email_address'         => ! empty(trim($data['specifier_email'])) ? trim($data['specifier_email']) : null,
            'updated_at'            => new Expression('GETDATE()'),
            'updated_by'            => $user['id'],
        ];

        try {
            $this->address->update(
                $info,
                [
                    'addressable_id' => $id,
                    'addressable_type' => 'App\Models\Specifier'
                ]
            );
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
            ->where([
                'addressable_id' => $id,
                'addressable_type' => 'App\Models\Architect'
            ]);

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
            ->where([
                'addressable_id' => $specifier_id,
                'addressable_type' => 'App\Models\Specifier'
            ]);

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
            ->where(['id' => $id]);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute()->current();
        return $result;
    }
}
