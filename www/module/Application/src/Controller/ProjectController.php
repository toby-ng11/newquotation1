<?php
declare(strict_types=1);

namespace Application\Controller;

use Laminas\Mvc\Controller\AbstractActionController;
use Laminas\Mvc\Plugin\FlashMessenger;
use Laminas\View\Model\{ViewModel, JsonModel};

use Application\Service\UserService;
use Application\Model\{Project, Quote, Location, Item, Note, Architect, Specifier};

class ProjectController extends AbstractActionController
{
    protected $userService;
    protected $project;
    protected $location;
    protected $item;
    protected $note;
    protected $architect;
    protected $specifier;

    public function __construct(
        UserService $userService,
        Project $project,
        Location $location,
        Item $item,
        Note $note,
        Architect $architect,
        Specifier $specifier
        )
    {
        $this->userService = $userService;
        $this->project = $project;
        $this->location = $location;
        $this->item = $item;
        $this->note = $note;
        $this->architect = $architect;
        $this->specifier = $specifier;
    }

    public function newAction()
    {
        $user = $this->userService->getCurrentUser();
        $company = $this->location->fetchAllCompanies();
        $location = $this->location->fetchAllBranches();
        $status = $this->project->fetchProjectStatus();
        $marketSegment = $this->project->fetchProjectSegment();

        return new ViewModel([
            'user' => $user,
            'company' => $company,
            'locations' => $location,
            'status' => $status,
            'seg' => $marketSegment
        ]);
    }

    public function editAction()
    {
        $project_id = (int) $this->params()->fromRoute('id');

        if (!$project_id) {
            return $this->redirect()->toRoute('project');
        }

        $user = $this->userService->getCurrentUser();
        $project = $this->project->fetchById($project_id);
        $location = $this->location->fetchAllBranches();
        $company = $this->location->fetchAllCompanies();
        $status = $this->project->fetchProjectStatus();
        $marketSegment = $this->project->fetchProjectSegment();
        $architect = $this->architect->fetchArchitectById($project['architect_id']);
        $specifierList = $this->specifier->fetchSpecifiersByArchitect($project['architect_id']);
        $specifier = $this->specifier->fetchSpecifierById($project['specifier_id']);

        $owner = false;

        if($user['id'] === $project['shared_id'] || $user['id'] === $project['owner_id'] || $user['sale_role'] === 'admin' || $user['approve_id'] !== null) {
    		$owner = true;
    	}

        $request = $this->getRequest(); // for submit edit form

        if ($request->isPost()) {
            $data = $this->params()->fromPost();

            $result = $this->project->edit($data, $project_id);

            if ($result) {
                //$this->flashMessenger()->addSuccessMessage("Project saved successfully.");
                return $this->redirect()->toRoute('project', [
                    'action' => 'edit',
                    'id' => $project_id
                ]);
            } else {
                //$this->flashMessenger()->addErrorMessage("Save failed. Please try again.");
                return $this->redirect()->toRoute('project', ['action' => 'index']);
            }
        }

        return new ViewModel([
            'id' => $project_id,
            'user' => $user,
            'project' => $project,
            'company' => $company,
            'location' => $location,
            'status' => $status,
            'seg' => $marketSegment,
            'owner' => $owner,
            'architect' => $architect,
            'specifierList' => $specifierList,
            'specifier' => $specifier
        ]);
    }

    public function createAction() {
        $request = $this->getRequest();

        if ($request->isPost()) {
            $data = $this->params()->fromPost();

            $project_id = $this->project->save($data);

            if ($project_id) {
                return $this->redirect()->toRoute('project', [
                    'action' => 'edit',
                    'id' => $project_id
                ]);
            } else {
                return $this->redirect()->toRoute('project', ['action' => 'index']);
            }
        }
    }

    public function quotetableAction() {
        $request = $this->getRequest();
        if ($request->isXmlHttpRequest()) { 
            $project_id = $this->params()->fromRoute('id');
            $projectQuotes = $this->project->fetchQuoteByProject($project_id);
            $view = new JsonModel($projectQuotes);
            return $view;
        }
        return $this->getResponse()->setStatusCode(404);
    }

}