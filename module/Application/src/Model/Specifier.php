<?php

namespace Application\Model;

use Application\Service\UserService;
use Laminas\Db\Adapter\Adapter;
use Laminas\Db\Sql\{Sql, Expression};
use Exception;
use Laminas\Db\TableGateway\TableGateway;
use Psr\Container\ContainerInterface;
use Application\Helper\InputValidator;

class Specifier
{
    protected $adapter;
    protected $specifier;
    protected $container;

    public function __construct(
        Adapter $adapter,
        TableGateway $specifier,
        ContainerInterface $container
    ) {
        $this->adapter = $adapter;
        $this->specifier = $specifier;
        $this->container = $container;
    }

    public function getAddress(): Address
    {
        return $this->container->get(Address::class);
    }

    public function getUserSerive(): UserService
    {
        return $this->container->get(UserService::class);
    }

    public function add($data, $architect_id)
    {
        if (! InputValidator::isValidData($data) || ! InputValidator::isValidId($architect_id)) {
            return false;
        }

        $user = $this->getUserSerive()->getCurrentUser();

        $info = [
            'first_name'        => trim($data['specifier_first_name']),
            'last_name'         => trim($data['specifier_last_name']),
            'job_title'         => trim($data['specifier_job_title']),
            'architect_id'      => $architect_id,
            'created_at'        => new Expression('GETDATE()'),
            'created_by'        => $user['id'],
            'updated_by'        => $user['id'],
        ];

        try {
            $this->specifier->insert($info);
            $newSpecId = $this->specifier->getLastInsertValue();

            if (empty($data['specifier_address_id'])) {
                $this->getAddress()->addSpecifierAddress($data, $newSpecId);
            } else {
                $this->getAddress()->editSpecifierAddress($data, $data['specifier_address_id']);
            }

            return $newSpecId;
        } catch (Exception $e) {
            error_log("Specifer\add:Database Insert Error: " . $e->getMessage());
            return false;
        }
    }

    public function edit($data, $id)
    {
        if (! InputValidator::isValidData($data) || ! InputValidator::isValidId($id)) {
            return false;
        }

        $user = $this->getUserSerive()->getCurrentUser();

        $info = [
            'first_name'        => trim($data['specifier_first_name']),
            'last_name'         => trim($data['specifier_last_name']),
            'job_title'         => trim($data['specifier_job_title']),
            'updated_at'         => new Expression('GETDATE()'),
            'updated_by'        => $user['id'],
        ];

        if (empty($data['specifier_address_id'])) {
            $this->getAddress()->addSpecifierAddress($data, $id);
        } else {
            $this->getAddress()->editSpecifierAddress($data, $data['specifier_address_id']);
        }

        try {
            $this->specifier->update($info, ['id' => $id]);
            return $id;
        } catch (Exception $e) {
            error_log("Specifer\update:Database Update Error: " . $e->getMessage());
            return false;
        }
    }

    public function delete($id)
    {
        if (! InputValidator::isValidId($id)) {
            return false;
        }

        $specfier = $this->fetchSpecifierById($id);

        try {
            $this->specifier->update([
                'deleted_at' => new Expression('GETDATE()'),
            ], ['id' => $id]);
            $this->getAddress()->delete($specfier['address_id']);
            return $id;
        } catch (Exception $e) {
            error_log("Specifier\delete: Database Update Error: " . $e->getMessage());
            return false;
        }
    }

    public function fetchSpecifiersByArchitect($architect_id)
    {
        if (! InputValidator::isValidId($architect_id)) {
            return false;
        }

        $sql = new Sql($this->adapter);
        $select = $sql->select('p2q_view_specifier_x_address')
            ->where(['architect_id' => $architect_id]);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        return iterator_to_array($result, true);
    }

    public function fetchSpecifierById($id)
    {
        if (! InputValidator::isValidId($id)) {
            return false;
        }

        $sql = new Sql($this->adapter);

        $select = $sql->select('p2q_view_specifier_x_address')
            ->where(['id' => $id]);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        return $result->current();
    }
}
