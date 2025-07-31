<?php

namespace Application\Model;

use Exception;
use Laminas\Db\ResultSet\ResultSet;
use Laminas\Db\TableGateway\TableGateway;

class RoleOverride
{
    protected $roleOverride;

    public function __construct(
        TableGateway $roleOverride,
    ) {
        $this->roleOverride = $roleOverride;
    }

    public function fetchAll()
    {
        return $this->roleOverride->select();
    }

    public function fetchById($id)
    {
        /** @var ResultSet */
        $rowset = $this->roleOverride->select(['user_id' => $id]);
        return $rowset->current();
    }

    public function create($data)
    {
        $info = [
            'user_id' => $data['ro_user_id'],
            'override_role' => $data['ro_role'],
        ];

        try {
            $this->roleOverride->insert($info);
            return true;
        } catch (Exception $e) {
            error_log("RoleOverride\save:Database Insert Error: " . $e->getMessage());
            return false;
        }
    }

    public function update($id, $data)
    {
        $info = [
            'override_role' => $data['ro_role'],
        ];

        try {
            $this->roleOverride->update($info, ['user_id' => $id]);
            return true;
        } catch (Exception $e) {
            error_log("RoleOverride/update:Database Update Error: " . $e->getMessage());
            return false;
        }
    }

    public function delete($id)
    {
        try {
            $this->roleOverride->delete(['user_id' => $id]);
            return true;
        } catch (Exception $e) {
            error_log("RoleOverride/delete:Database Delete Error: " . $e->getMessage());
            return false;
        }
    }
}
