<?php

namespace Application\Model;

class RoleOverride extends BaseModel
{
    protected $primaryKey = 'user_id';

    protected function prepareDataForCreate($data)
    {
        $info = [
            'user_id' => ! empty(trim($data['ro_user_id'])) ? trim($data['ro_user_id']) : null,
            'override_role' => $data['ro_role'],
        ];

        $info = parent::prepareDataForCreate($info);
        return $info;
    }

    protected function prepareDataForUpdate($data, $id)
    {
        $info = [
            'override_role' => $data['ro_role'],
        ];

        $info = parent::prepareDataForCreate($info);
        return $info;
    }
}
