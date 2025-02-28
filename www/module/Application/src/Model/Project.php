<?php

namespace Application\Model;

use Laminas\Db\TableGateway\TableGatewayInterface;

class Project
{
    protected $project;
    protected $p2q_view_project;

    public function __construct(TableGatewayInterface $project, TableGatewayInterface $p2q_view_project)
    {
        $this->project = $project;
        $this->p2q_view_project = $p2q_view_project;
    }

    public function fetchAll()
    {
        return $this->project->select()->toArray();
    }

    public function fetchAllViews()
    {
        return $this->p2q_view_project->select()->toArray();
    }
}