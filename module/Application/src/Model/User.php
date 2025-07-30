<?php

namespace Application\Model;

use Laminas\Db\Adapter\Adapter;
use Laminas\Db\Adapter\Driver\ResultInterface;
use Laminas\Db\TableGateway\TableGatewayInterface;
use Laminas\Db\Sql\Sql;
use Application\Helper\InputValidator;

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
        if (! InputValidator::isValidData($username)) {
            return false;
        }

        /**  @var ResultInterface $rowset */
        $rowset = $this->P21_Users->select(['id' => $username]);
        return $rowset->current();
    }

    public function fetchUserIdByPattern($pattern, $limit = 10)
    {
        if (! InputValidator::isValidPattern($pattern)) {
            return false;
        }
        $sql = new Sql($this->adapter, 'P21_Users');
        $select = $sql->select()
            ->columns(['id', 'name']);

        $select->where->nest()
            ->like('id', $pattern . '%')
            ->or
            ->like('name', $pattern . '%')
            ->unnest();

        $select->limit($limit)->offset(0);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        return $result;
    }

    public function fetchaAllApprovalID($company = DEFAULT_COMPANY)
    {
        $sql = new Sql($this->adapter, 'P21_Users');
        $select = $sql->select()
            ->columns(['id', 'name', 'default_company'])
            ->where(['default_company' => $company]);

        $select->where->nest()
            ->like('role', '%Sales%')->or
            ->like('role', '%Manager%')->or
            ->like('role', '%Accounts Receivable%')
            ->unnest();

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        return $result;
    }
}
