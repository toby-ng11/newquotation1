<?php

namespace Application\Controller;

use Laminas\Mvc\Controller\AbstractActionController;
use Laminas\View\Model\{ViewModel, JsonModel};

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

    public function editAction()
    {
        $architect_id = (int) $this->params()->fromRoute('id');

        if (!$architect_id) {
            return $this->redirect()->toRoute('index', ['action' => 'architect']);
        }

        $architect = $this->architect->fetchArchitectById($architect_id);

        $request = $this->getRequest(); // for submit edit form

        if ($request->isPost()) {
            $data = $this->params()->fromPost();

            $result = $this->architect->edit($data, $architect_id);

            if ($result) {
                $this->flashMessenger()->addSuccessMessage("Architect saved successfully!");

                if ($request->isXmlHttpRequest()) {
                    return new JsonModel([
                        'success' => (bool) $result,
                        'message' => $result ? 'Architect saved successfully.' : 'Save failed. Please try again.',
                        'redirect' => $this->url()->fromRoute('architect', [
                            'action' => 'edit',
                            'id' => $architect_id
                        ])
                    ]);
                }

                return $this->redirect()->toRoute('project', [
                    'action' => 'edit',
                    'id' => $architect_id
                ]);
            } else {
                $this->flashMessenger()->addErrorMessage("Save failed. Please try again.");
                return $this->redirect()->toRoute('project', ['action' => 'index']);
            }
        }

        return new ViewModel([
            'id' => $architect_id
        ]);
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