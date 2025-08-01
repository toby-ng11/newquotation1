<?php

namespace Application\Model;

class RoleOverride extends Model
{
    protected $primaryKey = 'user_id';

    protected function prepareDataForCreate($data = [])
    {
        $info = [
            'user_id' => ! empty(trim($data['ro_user_id'])) ? trim($data['ro_user_id']) : null,
            'override_role' => $data['ro_role'],
        ];

        $info = parent::prepareDataForCreate($info);
        return $info;
    }

    protected function prepareDataForUpdate($id = 0, $data = [])
    {
        $info = [
            'override_role' => $data['ro_role'],
        ];

        $info = parent::prepareDataForUpdate($id, $info);
        return $info;
    }
}
