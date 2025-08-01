<?php

namespace Application\Model;

use Application\Helper\InputValidator;
use Laminas\Db\TableGateway\TableGateway;
use Laminas\Db\Sql\Select;
use Laminas\Db\Adapter\Adapter;
use Laminas\Db\Sql\Sql;
use Exception;

class Customer
{
    protected $adapter;
    protected $P21_customers_x_address;
    protected $P21_customers_x_address_x_contacts;

    public function __construct(
        Adapter $adapter,
        TableGateway $P21_customers_x_address,
        TableGateway $P21_customers_x_address_x_contacts
    ) {
        $this->adapter = $adapter;
        $this->P21_customers_x_address = $P21_customers_x_address;
        $this->P21_customers_x_address_x_contacts = $P21_customers_x_address_x_contacts;
    }

    public function fetchCustomerById($id)
    {
        if (! InputValidator::isValidId($id)) {
            return false;
        }

        $sql = new Sql($this->adapter);
        $select = $sql->select('P21_customers_x_address')
            ->where(['customer_id' => $id]);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute()->current();
        return iterator_to_array($result, true);
    }

    public function fetchCustomerByPattern($pattern, $limit = 10, $company = DEFAULT_COMPANY)
    {
        if (! InputValidator::isValidPattern($pattern)) {
            return false;
        }

        $sql = new Sql($this->adapter);
        $select = $sql->select('P21_customers_x_address')
            ->columns(['customer_id', 'customer_name', 'company_id', 'salesrep_full_name', 'from_P21'])
            ->where(['company_id' => $company])
            ->where(function ($where) use ($pattern) {
                $where->nest()->like('customer_id', $pattern . '%')
                    ->or
                    ->like('customer_name', $pattern . '%')
                    ->unnest();
            })
            ->order('customer_id ASC')
            ->limit($limit)->offset(0);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        return iterator_to_array($result, true);
    }

    public function fetchContactsByCustomer($customer_id)
    {
        if (! InputValidator::isValidId($customer_id)) {
            return false;
        }

        $sql = new Sql($this->adapter);
        $select = $sql->select('P21_customers_x_address_x_contacts')
            ->where(['customer_id' => $customer_id]);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        return iterator_to_array($result, true);
    }

    public function fetchCustomerByContact($contact_id, $company = DEFAULT_COMPANY)
    {
        if (! InputValidator::isValidId($contact_id)) {
            return false;
        }

        $sql = new Sql($this->adapter);
        $select = $sql->select('P21_customers_x_address_x_contacts')
            ->columns(['customer_id'])
            ->where(['company_id' => $company, 'contact_id' => $contact_id]);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $contact = $result->current(); // Get single row

        if (! $contact) {
            return false;
        }

        try {
            return $this->fetchCustomerById($contact['customer_id']);
        } catch (Exception $e) {
            error_log($e->getMessage());
            return false;
        }
    }

    public function fetchContactByID($contact_id)
    {
        if (! InputValidator::isValidId($contact_id)) {
            return false;
        }

        $select = $this->P21_customers_x_address_x_contacts->getSql()->select()
            ->columns([
                'contact_id',
                'email_address',
                'central_phone_number',
                'first_name',
                'last_name',
                'phys_address1',
                'phys_address2',
                'phys_city',
                'phys_state',
                'phys_postal_code',
                'phys_country'
            ])
            ->where(['contact_id' => $contact_id]);

        /** @var ResultSet $result */
        $result = $this->P21_customers_x_address_x_contacts->selectWith($select);
        return $result->current() ? $result->current()->getArrayCopy() : null;
    }
}
