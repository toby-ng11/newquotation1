<?php

namespace Application\Model;

use Laminas\Db\Sql\Expression;
use Laminas\Db\TableGateway\TableGatewayInterface;

class UserPreferenceTable
{
    protected $tableGateway;

    public function __construct(TableGatewayInterface $tableGateway)
    {
        $this->tableGateway = $tableGateway;
    }

    public function getByUserAndKey($userId, $key)
    {
        return $this->tableGateway->select([
            'user_id' => $userId,
            'key' => $key
        ])->current();
    }

    public function updateOrCreate($userId, $key, $value)
    {
        $existing = $this->getByUserAndKey($userId, $key);

        if ($existing) {
            $this->tableGateway->update([
                'value' => json_encode($value),
                'updated_at' => new Expression('GETDATE()')
            ], [
                'user_id' => $userId,
                'key' => $key,
            ]);
        } else {
            $this->tableGateway->insert([
                'user_id' => $userId,
                'key' => $key,
                'value' => json_encode($value),
                'created_at' => new Expression('GETDATE()'),
                'updated_at' => new Expression('GETDATE()'),
            ]);
        }
    }
}
