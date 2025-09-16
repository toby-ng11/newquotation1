<?php

namespace Application\Model;

use Application\Service\UserService;
use Laminas\Db\Adapter\Adapter;
use Psr\Container\ContainerInterface;

class OpportunityNote extends Model
{
    protected $timestamps = true;
    protected $userTracked = true;

    public function __construct(
        Adapter $adapter,
        UserService $userService,
        ContainerInterface $container,
    ) {
        parent::__construct($adapter, $userService, $container);
    }

    protected function prepareDataForCreate(array $data): array
    {
        error_log(print_r($data, true));
        $info = [
            'opportunity_id' => $data['opportunity_id'],
            'title' => ! empty(trim($data['title'])) ? trim($data['title']) : null,
            'content' => trim($data['content']),
            'next_action' => ! empty(trim($data['next_action'])) ? trim($data['next_action']) : null,
            'notified_at' => ! empty($data['notified_at']) ? $data['notified_at'] : null,
            'is_notified' => 0,
        ];

        $info = parent::prepareDataForCreate($info);
        return $info;
    }

    protected function prepareDataForUpdate(array $data, mixed $id = 0): array
    {
        error_log(print_r($data, true));
        $info = [
            'title' => ! empty(trim($data['title'])) ? trim($data['title']) : null,
            'content' => trim($data['content']),
            'next_action' => ! empty(trim($data['next_action'])) ? trim($data['next_action']) : null,
            'notified_at' => ! empty($data['notified_at']) ? $data['notified_at'] : null
        ];

        $info = parent::prepareDataForUpdate($info, $id);
        return $info;
    }
}
