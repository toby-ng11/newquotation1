<?php

namespace Application\Model;

use Application\Service\UserService;
use Application\Traits\HasModels;
use ArrayObject;
use Doctrine\Inflector\InflectorFactory;
use Exception;
use Laminas\Db\Adapter\Adapter;
use Laminas\Db\ResultSet\AbstractResultSet;
use Laminas\Db\ResultSet\ResultSet;
use Laminas\Db\Sql\Expression;
use Laminas\Db\TableGateway\TableGateway;
use Psr\Container\ContainerInterface;

class Model
{
    use HasModels;

    /** @var TableGateway */
    protected $tableGateway;

    /** @var UserService */
    protected $userService;

    /** @var ContainerInterface|null $container */
    protected $container;

    /**
     * The table associated with the model.
     *
     * @var string|null
     */
    protected $table;

    /**
     * The primary key for the model.
     *
     * @var string|null
     */
    protected $primaryKey;

    /** Indicate the table should be tracked. Require table to have "created_by" and "updated_by".
     *
     * @var bool
     */
    protected $userTracked = false;

    /** Indicate the table should be timestamped. Require table to have "created_at" and "updated_at".
     *
     * @var bool
     */
    protected $timestamps = false;

    /** Indicate the table should be soft deleted.
     *
     * @var bool
     */
    protected $softDeletes  = false;

    public function __construct(
        Adapter $adapter,
        UserService $userService,
        ContainerInterface $container,
    ) {
        $this->table = $this->table ?? $this->inferTableName();
        $this->primaryKey = $this->primaryKey ?? 'id';
        $this->tableGateway = new TableGateway($this->table, $adapter);
        $this->userService = $userService;
        $this->container = $container;
    }

    protected function inferTableName(): string
    {
        $class = static::class;
        $parts = explode('\\', $class);
        $base = preg_replace('/Model$/', '', end($parts)); // remove "Model" suffix
        $snake = strtolower(preg_replace('/(?<!^)[A-Z]/', '_$0', $base)); // camelCase → snake_case

        return InflectorFactory::create()->build()->pluralize($snake);
    }

    public function getTable(): string
    {
        return $this->table ?? $this->inferTableName();
    }

    public function getKey(): string
    {
        return $this->primaryKey ?? 'id';
    }

    public function findBy(array $where): array
    {
        /** @var AbstractResultSet $rowset */
        $rowset =  $this->tableGateway->select($where);

        if ($rowset->count() === 1) {
            return $rowset->current() ?? [];
        }

        return $rowset->toArray();
    }

    public function all(): array
    {
        $rowset = $this->tableGateway->select();
        return iterator_to_array($rowset, true);
    }

    public function find(mixed $id = 0): array
    {
        /** @var ResultSet */
        $rowset = $this->tableGateway->select([$this->getKey() => $id]);

        $row = $rowset->current();
        if ($row instanceof ArrayObject) {
            return $row->getArrayCopy();
        }

        return is_array($row) ? $row : [];
    }

    public function create(array $data): int|string|false
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

    public function update(mixed $whereId, array $data): bool
    {
        try {
            $data = $this->prepareDataForUpdate($data, $whereId);
            $this->tableGateway->update($data, [$this->getKey() => $whereId]);
            return true;
        } catch (Exception $e) {
            error_log(sprintf('%s create(): Database Update Error: %s', static::class, $e->getMessage()));
            return false;
        }
    }

    public function delete(mixed $id): bool
    {
        $data = [];

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
                $this->tableGateway->update([$data], [$this->getKey() => $id]);
            } else {
                $this->tableGateway->delete([$this->getKey() => $id]);
            }
            return true;
        } catch (Exception $e) {
            error_log(sprintf('%s create(): Database Delete Error: %s', static::class, $e->getMessage()));
            return false;
        }
    }

    protected function prepareDataForCreate(array $data): array
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

    protected function prepareDataForUpdate(array $data, mixed $id = 0): array
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
