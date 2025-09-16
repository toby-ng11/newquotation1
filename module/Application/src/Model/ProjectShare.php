<?php

namespace Application\Model;

use Application\Helper\InputValidator;
use Application\Service\UserService;
use Exception;
use Laminas\Db\Adapter\Adapter;
use Laminas\Db\Adapter\Driver\ResultInterface;
use Laminas\Db\Sql\Expression;
use Laminas\Db\Sql\Sql;
use Laminas\Db\TableGateway\TableGateway;
use Psr\Container\ContainerInterface;

class ProjectShare extends Model
{
    protected $container;

    public function __construct(
        Adapter $adapter,
        UserService $userService,
        ContainerInterface $container,
    ) {
        parent::__construct($adapter, $userService, $container);
    }

    public function isShared(int $projectId, string $userId): bool
    {
        $row = $this->findBy([
            'project_id' => $projectId,
            'shared_user' => $userId
        ]);

        return !empty($row);
    }
}
