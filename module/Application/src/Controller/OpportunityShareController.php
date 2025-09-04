<?php

namespace Application\Controller;

use Laminas\View\Model\ViewModel;
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
        $table = $this->getOpportunityShareModel()->all();
        return $this->json([
            'success' => true,
            'data' => iterator_to_array($table),
        ]);
    }

    // GET /enpoint/:id
    public function get(mixed $id)
    {
        $row = $this->getOpportunityShareModel()->find($id);
        if (! $row) {
            return $this->abort404();
        }

        return $this->json([
            'success' => true,
            'opportinity' => $row,
        ]);
    }

    // POST /enpoint
    public function create(mixed $data)
    {
        $result = $this->getOpportunityShareModel()->create($data);
        return $this->json([
            'success' => $result !== false,
            'message' => $result !== false  ? 'Market segment added!' : 'Error! Please check log for more details.',
        ]);
    }

    // PUT /enpoint/:id
    public function update(mixed $id, mixed $data)
    {
        $result = $this->getOpportunityShareModel()->update($data, $id);
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
