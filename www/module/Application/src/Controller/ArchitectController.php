<?php

namespace Application\Controller;

use Laminas\Mvc\Controller\AbstractActionController;
use Laminas\View\Model\JsonModel;

use Application\Model\{Architect, Specifier};

class ArchitectController extends AbstractActionController
{
    protected $architect;
    protected $specifier;

    public function __construct(Architect $architect, Specifier $specifier)
    {
        $this->architect = $architect;
        $this->specifier = $specifier;
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

        $architect = $this->specifier->fetchSpecifiersByArchitect($id);

        return new JsonModel($architect);
    }

    public function specinfoAction() {
        $id = $this->params()->fromRoute('id', null);

        if (empty($id)) {
            return new JsonModel(['error' => 'ID is required']);
        }

        $architect = $this->specifier->fetchSpecifierById($id);

        return new JsonModel($architect);
    }
}