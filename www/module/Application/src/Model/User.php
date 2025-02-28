<?php

namespace Application\Model;

use Laminas\Db\TableGateway\TableGateway;

class User
{
    public $id;
    public $first_name;
    public $last_name;
    public $name;
    public $default_company;
    public $default_location_id;
    public $default_branch;
    public $branch_description;
    public $role_uid;
    public $email_address;
    public $role;

    protected $tableGateway;

    public function __construct(TableGateway $tableGateway)
    {
        $this->tableGateway = $tableGateway;
    }

    public function fetchsalebyid($username)
    {
        $rowset = $this->tableGateway->select(['id' => $username]);
        return $rowset->current();
    }
}