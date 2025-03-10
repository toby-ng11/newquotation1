<?php

namespace Application\Model;

use Laminas\Db\Adapter\Adapter;
use Laminas\Db\TableGateway\TableGatewayInterface;
use Laminas\Db\Sql\Sql;

class User
{
    protected $P21_Users;
    protected $adapter;

    public function __construct(
        Adapter $adapter, // can you either one, i just use Adapter for debugging and clearer query
        TableGatewayInterface $P21_Users
    ) {
        $this->adapter = $adapter;
        $this->P21_Users = $P21_Users;
    }

    public function fetchsalebyid($username)
    {
        return $this->P21_Users->select(['id' => $username])->current();
    }

    public function fetchUserIdByPattern($pattern, $limit = 10)
    {
        $sql = new Sql($this->adapter, 'P21_Users');
        $select = $sql->select()
            ->columns(['id', 'name'])
            ->where(function($where) use ($pattern) {
                $where->like('id', $pattern . '%')
                      ->or
                      ->like('name', $pattern . '%');
            })
            ->limit($limit);

        $selectString = $sql->buildSqlString($select);
        $result = $this->adapter->query($selectString, $this->adapter::QUERY_MODE_EXECUTE);
        return $result;
    }
}