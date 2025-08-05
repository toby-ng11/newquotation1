<?php

namespace Application\Model;

use Application\Config\Defaults;
use Laminas\Db\Adapter\Adapter;
use Laminas\Db\ResultSet\ResultSet;
use Laminas\Db\TableGateway\TableGatewayInterface;
use Laminas\Db\Sql\Sql;
use Application\Helper\InputValidator;
use ArrayObject;

class User
{
    protected $P21_Users;
    protected $adapter;

    public function __construct(
        Adapter $adapter,
        TableGatewayInterface $P21_Users
    ) {
        $this->adapter = $adapter;
        $this->P21_Users = $P21_Users;
    }

    /**
     * @return array{
     *     id: string,
     *     first_name: string,
     *     last_name: string,
     *     name: string,
     *     email_address: string,
     *     role: string,
     *     role_uid: string,
     *     p2q_system_role: string,
     *     default_company: string,
     *     default_location_id: string
     * } | array
     */
    public function fetchsalebyid(string $username): array
    {
        if (! InputValidator::isValidPattern($username)) {
            return ['Not valid data.'];
        }

        /**  @var ResultSet $rowset */
        $rowset = $this->P21_Users->select(['id' => $username]);
        $row = $rowset->current();
        if ($row instanceof ArrayObject) {
            return $row->getArrayCopy();
        }

        return is_array($row) ? $row : [];
    }

    public function fetchUserIdByPattern(string $pattern, int $limit = 10): array
    {
        if (! InputValidator::isValidPattern($pattern)) {
            return [];
        }
        $sql = new Sql($this->adapter, 'P21_Users');
        $select = $sql->select()
            ->columns(['id', 'name', 'p2q_system_role']);

        $select->where->nest()
            ->like('id', $pattern . '%')
            ->or
            ->like('name', $pattern . '%')
            ->unnest();

        $select->limit($limit)->offset(0);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        return iterator_to_array($result, true);
    }

    public function fetchaAllApprovalID(string|null $company = Defaults::company()): array
    {
        if ($company === null) {
            return [];
        }

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
        return iterator_to_array($result, true);
    }
}
