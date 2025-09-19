<?php

namespace Application\Controller;

use Psr\Container\ContainerInterface;

class OpportunityShareController extends BaseController
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

        $opportunityId = $this->params()->fromQuery('opp', null);

        if ($opportunityId) {
            $data = $this->getOpportunityShareModel()->where(['opportunity_id' => $opportunityId]);
            return $this->json($data);
        }

        return $this->json([
            'success' => true,
            'data' => $this->getOpportunityShareModel()->all(),
        ]);
    }

    // GET /enpoint/:id
    public function get(mixed $id)
    {
        $request = $this->getRequest();
        if (!$this->expectsJson($request)) {
            return $this->abort404();
        }

        $row = $this->getOpportunityShareModel()->find($id);
        return $this->json([
            'success' => true,
            'opportinity' => $row,
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

        $opportunity = $this->getOpportunityModel()->find($data['opportunity_id']);
        if ($data['shared_user'] === $opportunity['created_by']) {
            return $this->json([
                'success' => false,
                'message' => "You can't share with the owner.",
            ]);
        }

        $existShare = $this->getOpportunityShareModel()->where([
            'opportunity_id' => $data['opportunity_id'],
            'shared_user' => $data['shared_user'],
        ]);

        if (! empty($existShare)) {
            return $this->json([
                'success' => false,
                'message' => 'This user is already shared.',
            ]);
        }

        $result = $this->getOpportunityShareModel()->create($data);
        return $this->json([
            'success' => $result !== false,
            'message' => $result !== false  ? 'Share successfully!' : 'Error! Please check log for more details.',
        ]);
    }

    // PUT /enpoint/:id
    public function update(mixed $id, mixed $data)
    {
        $result = $this->getOpportunityShareModel()->update($id, $data);
        return $this->json([
            'success' => $result !== false,
            'message' => $result !== false ? 'Saved successfully!' : 'Error! Please check log for more details.',
        ]);
    }

    // DELETE /enpoint/:id
    public function delete(mixed $id)
    {
        $result = $this->getOpportunityShareModel()->delete($id);
        return $this->json([
            'success' => $result !== false,
            'message' => $result !== false ? 'Deleted successfully!' : 'Error! Please check log for more details.',
        ]);
    }
}
