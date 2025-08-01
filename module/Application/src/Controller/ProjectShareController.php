<?php

namespace Application\Controller;

use Application\Model\ProjectShare;
use Application\Service\UserService;
use Exception;
use Psr\Container\ContainerInterface;

class ProjectShareController extends BaseController
{
    protected $project_share;

    public function __construct(ProjectShare $project_share, ContainerInterface $container)
    {
        $this->project_share = $project_share;
        parent::__construct($container);
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
                return $this->json([
                    'success' => false,
                    'message' => 'No shared user found.'
                ]);
            }

            return $this->json([
                'success' => true,
                'project_share' => [
                    'shared_user' => $project_share['shared_user'],
                    'role' => $project_share['role'],
                ],
            ]);
        }
        return $this->abort404();
    }

    public function createAction()
    {
        if ($this->getRequest()->isXmlHttpRequest()) {
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
                return $this->json([
                    'success' => false,
                    'message' => 'Missing required fields: ' . implode(', ', $missingFields)
                ]);
            }

            $user = $this->getUserService()->getCurrentUser();

            if ($user['id'] === $data['shared_user']) {
                return $this->json([
                    'success' => false,
                    'message' => "You can't share a project with yourself!",
                ]);
            }

            $isShareExists = $this->project_share->isShareExists($project_id, $data['shared_user']);

            if ($isShareExists) {
                return $this->json([
                    'success' => false,
                    'message' => 'This user is already shared!',
                ]);
            }

            try {
                $result = $this->project_share->add($data, $project_id);

                return $this->json([
                    'success' => true,
                    'message' => 'Share successfully!',
                ]);
            } catch (Exception $e) {
                return $this->json([
                    'success' => false,
                    'message' => 'Failed to share project',
                    'error' => $e->getMessage()
                ]);
            }
        }
        return $this->abort404();
    }

    public function editAction()
    {
        $request = $this->getRequest();
        $projects_share_id = $this->params()->fromRoute('id');

        if (! $projects_share_id) {
            return $this->json([
                'success' => false,
                'message' => 'Missing ID.'
            ]);
        }

        if ($request->isPost()) {
            $data = $this->params()->fromPost();

            try {
                $result = $this->project_share->edit($data, $projects_share_id);

                return $this->json([
                    'success' => true,
                    'message' => 'Saved change!',
                    'note_id' => $result
                ]);
            } catch (Exception $e) {
                return $this->json([
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
            return $this->json([
                'success' => false,
                'message' => 'Invalid request.',
            ]);
        }

        if ($request->isPost()) {
            try {
                $result = $this->project_share->delete($projects_share_id);

                if ($result) {
                    return $this->json([
                        'success' => true,
                        'message' => 'Saved change!',
                    ]);
                } else {
                    return $this->json([
                        'success' => false,
                        'message' => 'Failed to delete share.',
                    ]);
                }
            } catch (Exception $e) {
                return $this->json([
                    'success' => false,
                    'message' => 'Failed to delete share.',
                    'error' => $e->getMessage()
                ]);
            }
        }

        return $this->abort404();
    }
}
