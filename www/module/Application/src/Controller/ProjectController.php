<?php
declare(strict_types=1);

namespace Application\Controller;

use Laminas\Mvc\Controller\AbstractActionController;
use Laminas\View\Model\{ViewModel, JsonModel};

use Application\Service\UserService;
use Application\Model\{Project, Quote, Location};

class ProjectController extends AbstractActionController
{
    protected $userService;
    protected $project;
    protected $location;

    public function __construct(
        UserService $userService,
        Project $project,
        Location $location
        )
    {
        $this->userService = $userService;
        $this->project = $project;
        $this->location = $location;
    }

    public function indexAction()
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
        $id = (int) $this->params()->fromRoute('id');

        if (!$id) {
            return $this->redirect()->toRoute('project');
        }

        $project = $this->project->fetchById($id);
        $location = $this->location->fetchAllBranches();
        $status = $this->project->fetchProjectStatus();
        $marketSegment = $this->project->fetchProjectSegment();

        return new ViewModel([
            'id' => $id,
            'project' => $project,
            'location' => $location,
            'status' => $status,
            'seg' => $marketSegment
        ]);
    }

    public function createAction() {
        $request = $this->getRequest();

        if ($request->isPost()) {
            $data = $this->params()->fromPost();

            $projectId = $this->project->save($data);

            if ($projectId) {
                return $this->redirect()->toRoute('project', [
                    'action' => 'edit',
                    'id' => $projectId
                ]);
            } else {
                return $this->redirect()->toRoute('project', ['action' => 'index']);
            }
        }
    }

}