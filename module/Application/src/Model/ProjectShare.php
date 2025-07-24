<?php

namespace Application\Model;

use Laminas\Db\Adapter\Adapter;
use Laminas\Db\TableGateway\TableGateway;
use Psr\Container\ContainerInterface;

class ProjectShare
{
    protected $adapter;
    protected $project_shares;
    protected $container;

    public function __construct(
        Adapter $adapter,
        TableGateway $project_shares,
        ContainerInterface $container
    ) {
        $this->adapter = $adapter;
        $this->project_shares = $project_shares;
        $this->container = $container;
    }

    #TODO: create, edit, delete, fetchById
}
