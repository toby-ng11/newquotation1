<?php

namespace Application\Controller;

use Psr\Container\ContainerInterface;

class OpportunityNoteController extends BaseController
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
            $data = $this->getOpportunityNoteModel()->findBy(['opportunity_id' => $opportunityId]);
            return $this->json($data);
        }

        return $this->json([
            'success' => true,
            'data' => $this->getOpportunityNoteModel()->all(),
        ]);
    }

    // GET /enpoint/:id
    public function get(mixed $id)
    {
        $request = $this->getRequest();
        if (!$this->expectsJson($request)) {
            return $this->abort404();
        }

        $row = $this->getOpportunityNoteModel()->find($id);
        return $this->json($row);
    }

    // POST /enpoint
    public function create(mixed $data)
    {
        $result = $this->getOpportunityNoteModel()->create($data);
        return $this->json([
            'success' => $result !== false,
            'message' => $result !== false  ? 'Share successfully!' : 'Error! Please check log for more details.',
        ]);
    }

    // PUT /enpoint/:id
    public function update(mixed $id, mixed $data)
    {
        $result = $this->getOpportunityNoteModel()->update($id, $data);
        return $this->json([
            'success' => $result !== false,
            'message' => $result !== false ? 'Saved successfully!' : 'Error! Please check log for more details.',
        ]);
    }

    // DELETE /enpoint/:id
    public function delete(mixed $id)
    {
        $result = $this->getOpportunityNoteModel()->delete($id);
        return $this->json([
            'success' => $result !== false,
            'message' => $result !== false ? 'Deleted successfully!' : 'Error! Please check log for more details.',
        ]);
    }
}
