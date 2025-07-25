<?php

namespace Application\Controller;

use Application\Model\ProjectShare;
use Application\Service\UserService;
use Error;
use Exception;
use Laminas\Mvc\Controller\AbstractActionController;
use Laminas\View\Model\JsonModel;
use Psr\Container\ContainerInterface;

class ProjectShareController extends AbstractActionController
{
    protected $project_share;
    protected $container;

    public function __construct(ProjectShare $project_share, ContainerInterface $container)
    {
        $this->project_share = $project_share;
        $this->container = $container;
    }

    public function getUserService()
    {
        return $this->container->get(UserService::class);
    }

    public function indexAction()
    {
        $request = $this->getRequest();

        if ($request->isPost()) {
            return $this->createAction();
        }

        $projectShareId = $this->params()->fromRoute('id');

        if ($projectShareId) {
            $project_share = $this->project_share->fetchByID($projectShareId);

            if (! $project_share) {
                return new JsonModel([
                    'success' => false,
                    'message' => 'No shared user found.'
                ]);
            }

            return new JsonModel([
                'success' => true,
                'project_share' => [
                    'shared_user' => $project_share['shared_user'],
                    'role' => $project_share['role'],
                ],
            ]);
        }
        return $this->notFoundAction();
    }

    public function createAction()
    {
        $project_id = $this->params()->fromPost('project_id', null);
        $data = $this->params()->fromPost();

        $missingFields = [];

        if (! $project_id) {
            $missingFields[] = 'Project ID';
        }
        if (empty($data['shared_user'])) {
            $missingFields[] = 'Shared user';
        }

        if (! $project_id || empty($data['shared_user'])) {
            return new JsonModel([
                'success' => false,
                'message' => 'Missing required fields: ' . implode(', ', $missingFields)
            ]);
        }

        $user = $this->getUserService()->getCurrentUser();

        if ($user['id'] === $data['shared_user']) {
            return new JsonModel([
                'success' => false,
                'message' => "You can't share a project with yourself!",
            ]);
        }

        $isShareExists = $this->project_share->isShareExists($project_id, $data['shared_user']);

        if ($isShareExists) {
            return new JsonModel([
                'success' => false,
                'message' => 'This user is already shared!',
            ]);
        }

        try {
            $result = $this->project_share->add($data, $project_id);

            return new JsonModel([
                'success' => true,
                'message' => 'Share successfully!',
            ]);
        } catch (Exception $e) {
            return new JsonModel([
                'success' => false,
                'message' => 'Failed to share project',
                'error' => $e->getMessage()
            ]);
        }
    }

    public function editAction()
    {
        $request = $this->getRequest();
        $projects_share_id = $this->params()->fromRoute('id');

        if (! $projects_share_id) {
            return new JsonModel([
                'success' => false,
                'message' => 'Missing ID.'
            ]);
        }

        if ($request->isPost()) {
            $data = $this->params()->fromPost();

            try {
                $result = $this->project_share->edit($data, $projects_share_id);

                return new JsonModel([
                    'success' => true,
                    'message' => 'Saved change!',
                    'note_id' => $result
                ]);
            } catch (Exception $e) {
                return new JsonModel([
                    'success' => false,
                    'message' => 'Failed to edit share.',
                    'error' => $e->getMessage()
                ]);
            }
        }

        return $this->notFoundAction();
    }

    public function deleteAction()
    {
        $projects_share_id = $this->params()->fromRoute('id', null);
        $request = $this->getRequest();

        if (! $projects_share_id || ! $request->isXmlHttpRequest()) {
            return new JsonModel([
                'success' => false,
                'message' => 'Invalid request.',
            ]);
        }

        if ($request->isPost()) {
            try {
                $result = $this->project_share->delete($projects_share_id);

                if ($result) {
                    return new JsonModel([
                        'success' => true,
                        'message' => 'Saved change!',
                    ]);
                } else {
                    return new JsonModel([
                        'success' => false,
                        'message' => 'Failed to delete share.',
                    ]);
                }
            } catch (Exception $e) {
                return new JsonModel([
                    'success' => false,
                    'message' => 'Failed to delete share.',
                    'error' => $e->getMessage()
                ]);
            }
        }

        return $this->notFoundAction();
    }
}
