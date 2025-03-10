<?php

namespace Application\Controller;

use Laminas\Mvc\Controller\AbstractActionController;
use Laminas\View\Model\JsonModel;

use Application\Model\Architect;

class ArchitectController extends AbstractActionController
{
    protected $architect;

    public function __construct(Architect $architect)
    {
        $this->architect = $architect;
    }

    public function fetchAction()
    {
        $pattern = $this->params()->fromQuery('term', null);

        if (empty($pattern)) {
            return new JsonModel(['error' => 'Pattern is required']);
        }

        $architect = $this->architect->fetchArchitectByPattern($pattern);

        return new JsonModel($architect);
    }

    public function fetchfullAction() {
        $id = $this->params()->fromRoute('id', null);

        if (empty($id)) {
            return new JsonModel(['error' => 'ID is required']);
        }

        $architect = $this->architect->fetchArchitectById($id);

        return new JsonModel($architect);
    }

    public function fetchspecsAction() {
        $id = $this->params()->fromRoute('id', null);

        if (empty($id)) {
            return new JsonModel(['error' => 'ID is required']);
        }

        $architect = $this->architect->fetchSpecifiersByArchitect($id);

        return new JsonModel($architect);
    }

    public function specinfoAction() {
        $id = $this->params()->fromRoute('id', null);

        if (empty($id)) {
            return new JsonModel(['error' => 'ID is required']);
        }

        $architect = $this->architect->fetchSpecifierById($id);

        return new JsonModel($architect);
    }
}