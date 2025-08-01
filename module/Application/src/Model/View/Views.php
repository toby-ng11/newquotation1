<?php

namespace Application\Model\View;

use Doctrine\Inflector\InflectorFactory;
use Exception;
use Laminas\Db\Adapter\Adapter;
use Laminas\Db\ResultSet\ResultSet;
use Laminas\Db\Sql\Expression;
use Laminas\Db\TableGateway\TableGateway;

class Views
{
    /** @var TableGateway */
    protected $tableGateway;

    /**
     * The views table associated with the model.
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

    public function __construct(
        Adapter $adapter,
    ) {
        $this->table = $this->table ?? $this->inferTableName();
        $this->primaryKey = $this->primaryKey ?? 'id';
        $this->tableGateway = new TableGateway($this->table, $adapter);
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

    public function findBy($where = []): array
    {
        $rowset =  $this->tableGateway->select($where);
        return iterator_to_array($rowset, true);
    }

    public function all()
    {
        $rowset = $this->tableGateway->select();
        return iterator_to_array($rowset, true);
    }

    public function find($id)
    {
        /** @var ResultSet */
        $rowset = $this->tableGateway->select([$this->primaryKey => $id]);
        return $rowset->current();
    }
}
