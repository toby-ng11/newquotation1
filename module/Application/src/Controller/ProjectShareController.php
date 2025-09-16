<?php

namespace Application\Controller;

use Psr\Container\ContainerInterface;

class ProjectShareController extends BaseController
{
    public function __construct(ContainerInterface $container)
    {
        parent::__construct($container);
    }

    // GET /enpoint
    public function getList()
    {
        $request = $this->getRequest();
        if (!$this->expectsJson($request)) {
            return $this->abort404();
        }

        $projectId = $this->params()->fromQuery('project', null);

        if ($projectId) {
            $data = $this->getProjectShareModel()->findBy(['project_id' => $projectId]);
            return $this->json($data);
        }

        return $this->json([
            'success' => true,
            'data' => $this->getProjectShareModel()->all(),
        ]);
    }

    // GET /enpoint/:id
    public function get(mixed $id)
    {
        $request = $this->getRequest();
        if (!$this->expectsJson($request)) {
            return $this->abort404();
        }

        $row = $this->getProjectShareModel()->find($id);
        return $this->json([
            'success' => true,
            'project' => $row,
        ]);
    }

    // POST /enpoint
    public function create(mixed $data)
    {
        $user = $this->getUserService()->getCurrentUser();
        if ($user['id'] === $data['shared_user']) {
            return $this->json([
                'success' => false,
                'message' => "You can't share with yourself.",
            ]);
        }

        $project = $this->getProjectModel()->fetchById($data['project_id']);
        if ($data['shared_user'] === $project['created_by']) {
            return $this->json([
                'success' => false,
                'message' => "You can't share with the owner.",
            ]);
        }

        $existShare = $this->getProjectShareModel()->findBy([
            'project_id' => $data['project_id'],
            'shared_user' => $data['shared_user'],
        ]);

        if (! empty($existShare)) {
            return $this->json([
                'success' => false,
                'message' => 'This user is already shared.',
            ]);
        }

        $result = $this->getProjectShareModel()->create($data);
        return $this->json([
            'success' => $result !== false,
            'message' => $result !== false  ? 'Share successfully!' : 'Error! Please check log for more details.',
        ]);
    }

    // PUT /enpoint/:id
    public function update(mixed $id, mixed $data)
    {
        $result = $this->getProjectShareModel()->update($id, $data);
        return $this->json([
            'success' => $result !== false,
            'message' => $result !== false ? 'Saved successfully!' : 'Error! Please check log for more details.',
        ]);
    }

    // DELETE /enpoint/:id
    public function delete(mixed $id)
    {
        $result = $this->getProjectShareModel()->delete($id);
        return $this->json([
            'success' => $result !== false,
            'message' => $result !== false ? 'Deleted successfully!' : 'Error! Please check log for more details.',
        ]);
    }
}
