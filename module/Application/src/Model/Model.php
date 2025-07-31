<?php

namespace Application\Model;

use Application\Service\UserService;
use Doctrine\Inflector\InflectorFactory;
use Exception;
use Laminas\Db\Adapter\Adapter;
use Laminas\Db\ResultSet\ResultSet;
use Laminas\Db\Sql\Expression;
use Laminas\Db\TableGateway\TableGateway;

class Model
{
    /** @var TableGateway */
    protected $tableGateway;

    /** @var UserService */
    protected $userService;

    /**
     * The table associated with the model.
     *
     * @var string|null
     */
    protected $table;

    /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey;

    /** Indicate the table should be tracked. Require table to have "created_by" and "updated_by". */
    protected $userTracked = false;

    /** Indicate the table should be timestamped. Require table to have "created_at" and "updated_at". */
    protected $timestamps = false;

    /** Indicate the table should be soft deleted. */
    protected $softDeletes  = false;

    public function __construct(
        Adapter $adapter,
        UserService $userService,
    ) {
        $this->table = $this->table ?? $this->inferTableName();
        $this->primaryKey = $this->primaryKey ?? 'id';
        $this->tableGateway = new TableGateway($this->table, $adapter);
        $this->userService = $userService;
    }

    protected function inferTableName(): string
    {
        $class = static::class;
        $parts = explode('\\', $class);
        $base = preg_replace('/Model$/', '', end($parts)); // remove "Model" suffix
        $snake = strtolower(preg_replace('/(?<!^)[A-Z]/', '_$0', $base)); // camelCase → snake_case

        return InflectorFactory::create()->build()->pluralize($snake);
    }

    public function getTable()
    {
        return $this->table;
    }

    public function findBy(array $criteria)
    {
        return $this->tableGateway->select($criteria);
    }

    public function all()
    {
        return $this->tableGateway->select();
    }

    public function find($id)
    {
        /** @var ResultSet */
        $rowset = $this->tableGateway->select([$this->primaryKey => $id]);
        return $rowset->current();
    }

    public function create($data)
    {
        try {
            $data = $this->prepareDataForCreate($data);
            $this->tableGateway->insert($data);
            return $this->tableGateway->getLastInsertValue();
        } catch (Exception $e) {
            error_log(sprintf('%s create(): Database Insert Error: %s', static::class, $e->getMessage()));
            return false;
        }
    }

    public function update($id, $data)
    {
        try {
            $data = $this->prepareDataForUpdate($data, $id);
            $this->tableGateway->update($data, [$this->primaryKey => $id]);
            return true;
        } catch (Exception $e) {
            error_log(sprintf('%s create(): Database Update Error: %s', static::class, $e->getMessage()));
            return false;
        }
    }

    public function delete($id)
    {
        if ($this->userTracked && $this->softDeletes) {
            $user = $this->userService->getCurrentUser();
            $data['updated_by'] = $user['id'];
            $data['deleted_at'] = new Expression('GETDATE()');
        }

        if ($this->softDeletes) {
            $data['deleted_at'] = new Expression('GETDATE()');
        }

        try {
            if ($this->softDeletes) {
                $this->tableGateway->update([$data], [$this->primaryKey => $id]);
            } else {
                $this->tableGateway->delete([$this->primaryKey => $id]);
            }
            return true;
        } catch (Exception $e) {
            error_log(sprintf('%s create(): Database Delete Error: %s', static::class, $e->getMessage()));
            return false;
        }
    }

    protected function prepareDataForCreate($data)
    {
        if ($this->userTracked) {
            $user = $this->userService->getCurrentUser();
            $data['created_by'] = $user['id'];
        }

        if ($this->timestamps) {
            $data['created_at'] = new Expression('GETDATE()');
        }

        return $data;
    }

    protected function prepareDataForUpdate($data, $id)
    {
        if ($this->userTracked) {
            $user = $this->userService->getCurrentUser();
            $data['updated_by'] = $user['id'];
        }

        if ($this->timestamps) {
            $data['updated_at'] = new Expression('GETDATE()');
        }

        return $data;
    }
}
