<?php

namespace Application\Controller;

use Laminas\Mvc\Controller\AbstractActionController;
use Laminas\View\Model\JsonModel;

use Application\Model\{Architect, Specifier, Address};

class ArchitectController extends AbstractActionController
{
    protected $architect;
    protected $specifier;
    protected $address;

    public function __construct(Architect $architect, Address $address, Specifier $specifier)
    {
        $this->architect = $architect;
        $this->address = $address;
        $this->specifier = $specifier;
    }

    public function indexAction()
    {
        $pattern = $this->params()->fromQuery('search', '');

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

    public function addressAction() {
        $id = $this->params()->fromRoute('id', null);

        if (empty($id)) {
            return new JsonModel(['error' => 'ID is required']);
        }

        $address = $this->address->fetchAddressesByArchitect($id);

        return new JsonModel($address);
    }

    public function addressinfoAction() {
        $id = $this->params()->fromRoute('id', null);

        if (empty($id)) {
            return new JsonModel(['error' => 'ID is required']);
        }

        $address = $this->address->fetchAddressesById($id);

        return new JsonModel($address);
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