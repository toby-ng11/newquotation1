<?php

namespace Application\Controller;

use Laminas\Mvc\Controller\AbstractActionController;
use Laminas\Mvc\Plugin\FlashMessenger;
use Laminas\View\Model\{ViewModel, JsonModel};

use Application\Model\{Architect, Specifier, Address, Location, Project};
use Application\Service\UserService;

class ArchitectController extends AbstractActionController
{
    protected $userService;
    protected $architect;
    protected $specifier;
    protected $address;
    protected $location;
    protected $project;

    public function __construct(
        UserService $userService,
        Architect $architect,
        Address $address,
        Specifier $specifier,
        Location $location,
        Project $project
    ) {
        $this->userService = $userService;
        $this->architect = $architect;
        $this->address = $address;
        $this->specifier = $specifier;
        $this->location = $location;
        $this->project = $project;
    }

    public function indexAction()
    {
        $pattern = $this->params()->fromQuery('search', '');
        $user = $this->userService->getCurrentUser();
        $admin = false;
        if ($user['sale_role'] === 'admin' || $user['approve_id'] !== null) {
            $admin = true;
        }

        if (empty($pattern)) {
            return new JsonModel(['error' => 'Pattern is required']);
        }

        $architect = $this->architect->fetchArchitectByPattern($admin, $pattern, $user['id']);

        return new JsonModel($architect);
    }

    public function editAction()
    {
        $architect_id = (int) $this->params()->fromRoute('id');

        if (!$architect_id) {
            return $this->redirect()->toRoute('index', ['action' => 'architect']);
        }

        $user = $this->userService->getCurrentUser();
        $location = $this->location->fetchAllBranches();
        $projectStatus = $this->project->fetchProjectStatus();
        $marketSegment = $this->project->fetchProjectSegment();
        $architect = $this->architect->fetchArchitectById($architect_id);
        $architectType = $this->architect->fetchArchitectType();
        $addressList = $this->address->fetchAddressesByArchitect($architect_id);
        $specifierList = $this->specifier->fetchSpecifiersByArchitect($architect_id);
        $company = $this->location->fetchAllCompanies();

        $request = $this->getRequest(); // for submit edit form

        if ($request->isPost()) {
            $data = $this->params()->fromPost();

            $result = $this->architect->edit($data, $architect_id);

            if ($result) {
                return new JsonModel([
                    'success' => true,
                    'message' => 'Architect updated successfully!',
                ]);
            } else {
                return new JsonModel([
                    'success' => false,
                    'message' => 'Save failed. Please try again.',
                ]);
            }
        }

        return new ViewModel([
            'id' => $architect_id,
            'user' => $user,
            'locations' => $location,
            'projectStatus' => $projectStatus,
            'marketSegment' => $marketSegment,
            'architect' => $architect,
            'architectType' => $architectType,
            'company' => $company,
            'addressList' => $addressList,
            'specifierList' => $specifierList,
        ]);
    }

    public function specifierstableAction()
    {
        $request = $this->getRequest();
        if ($request->isXmlHttpRequest()) {
            $architect_id = $this->params()->fromRoute('id');
            $specifiers = $this->specifier->fetchSpecifiersByArchitect($architect_id);
            $view = new JsonModel($specifiers);
            return $view;
        }
        return $this->getResponse()->setStatusCode(404);
    }

    public function fetchfullAction()
    {
        $id = $this->params()->fromRoute('id', null);

        if (empty($id)) {
            return new JsonModel(['error' => 'ID is required']);
        }

        $architect = $this->architect->fetchArchitectById($id);

        return new JsonModel($architect);
    }

    public function addressAction()
    {
        $id = $this->params()->fromRoute('id', null);

        if (empty($id)) {
            return new JsonModel(['error' => 'ID is required']);
        }

        $address = $this->address->fetchAddressesByArchitect($id);

        return new JsonModel($address);
    }

    public function addressinfoAction()
    {
        $id = $this->params()->fromRoute('id', null);

        if (empty($id)) {
            return new JsonModel(['error' => 'ID is required']);
        }

        $address = $this->address->fetchAddressesById($id);

        return new JsonModel($address);
    }

    public function fetchspecsAction()
    {
        $id = $this->params()->fromRoute('id', null);

        if (empty($id)) {
            return new JsonModel(['error' => 'ID is required']);
        }

        $architect = $this->specifier->fetchSpecifiersByArchitect($id);

        return new JsonModel($architect);
    }

    public function specinfoAction()
    {
        $id = $this->params()->fromRoute('id', null);

        if (empty($id)) {
            return new JsonModel(['error' => 'ID is required']);
        }

        $architect = $this->specifier->fetchSpecifierById($id);

        return new JsonModel($architect);
    }

    public function projectsAction()
    {
        $id = $this->params()->fromRoute('id', null);
        $isExport = $this->params()->fromQuery('export', null);

        if (empty($id)) {
            return new JsonModel(['error' => 'ID is required']);
        }

        $projects = $this->architect->fetchProjectsByArchitect($id);

        if ($isExport === 'excel') {
            $filename = "architect_{$id}_projects_" . date('Y-m-d') . ".xls";
    
            $headers = $this->getResponse()->getHeaders();
            $headers->addHeaderLine('Content-Type', 'application/vnd.ms-excel');
            $headers->addHeaderLine('Content-Disposition', 'attachment; filename="' . $filename . '"');
    
            $content = "Project ID\tProject Name\tStatus\n";
            foreach ($projects as $project) {
                $content .= "{$project['project_id']}\t{$project['project_name']}\t{$project['status_desc']}\n";
            }
    
            $response = $this->getResponse();
            $response->setContent($content);
            return $response;
        }

        return new JsonModel($projects);
    }
}
