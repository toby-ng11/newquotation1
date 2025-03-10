<?php

namespace Application\Model;

use Laminas\Db\TableGateway\TableGatewayInterface;
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
        TableGatewayInterface $P21_customers_x_address,
        TableGatewayInterface $P21_customers_x_address_x_contacts
    ) {
        $this->adapter = $adapter;
        $this->P21_customers_x_address = $P21_customers_x_address;
        $this->P21_customers_x_address_x_contacts = $P21_customers_x_address_x_contacts;
    }

    public function fetchCustomerById($id)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select('P21_customers_x_address')
            ->where(['customer_id' => $id]);

        $selectString = $sql->buildSqlString($select);
        $result = $this->adapter->query($selectString, $this->adapter::QUERY_MODE_EXECUTE);
        return $result->current();
    }

    public function fetchCustomerByPattern($pattern, $limit = 10, $company = DEFAULT_COMPANY)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select('P21_customers_x_address')
            ->where(function ($where) use ($pattern) {
                $where->like('customer_id', $pattern . '%')
                    ->or
                    ->like('customer_name', $pattern . '%');
            })
            ->where(['company_id' => $company])
            ->limit($limit);

        $selectString = $sql->buildSqlString($select);
        $result = $this->adapter->query($selectString, $this->adapter::QUERY_MODE_EXECUTE);
        return $result;
    }

    public function fetchContactsByCustomer($customer_id)
    {
        if ($customer_id === null) {
            return false;
        }

        $sql = new Sql($this->adapter);
        $select = $sql->select('P21_customers_x_address_x_contacts')
            ->where(['customer_id' => $customer_id]);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        return $result;
    }

    public function fetchCustomerByContact($contact_id, $company = DEFAULT_COMPANY)
    {
        if ($contact_id === null) {
            return false;
        }

        $sql = new Sql($this->adapter);
        $select = $sql->select('P21_customers_x_address_x_contacts')
            ->where(['company_id' => $company, 'contact_id' => $contact_id]);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        $contact = $result->current(); // Get single row

        if (!$contact) {
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
        if ($contact_id === null) {
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

        $result = $this->P21_customers_x_address_x_contacts->selectWith($select);
        return $result->current() ? $result->current()->getArrayCopy() : null;
    }
}
