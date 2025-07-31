<?php

namespace Application\Controller;

use Application\Model\MarketSegment;
use Laminas\View\Model\JsonModel;
use Psr\Container\ContainerInterface;

class RoleOverrideController extends BaseController
{
    protected $container;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    public function getMarketSegmentModel(): MarketSegment
    {
        return $this->container->get(MarketSegment::class);
    }

    // GET /enpoint
    public function getList()
    {
        $table = $this->getMarketSegmentModel()->fetchAll();
        return new JsonModel([
            'success' => true,
            'data' => iterator_to_array($table),
        ]);
    }

    // GET /enpoint/:id
    public function get($id)
    {
        $row = $this->getMarketSegmentModel()->fetchById($id);
        if (! $row) {
            return $this->abort404();
        }

        return new JsonModel([
            'success' => true,
            'role_override' => $row,
        ]);
    }

    // POST /enpoint
    public function create($data)
    {
        $result = $this->getMarketSegmentModel()->create($data);
        return new JsonModel([
            'success' => $result !== false,
            'message' => $result ? 'Role overridden!' : 'Error! Please check log for more details.',
        ]);
    }

    // PUT /enpoint/:id
    public function update($id, $data)
    {
        $result = $this->getMarketSegmentModel()->update($id, $data);
        return new JsonModel([
            'success' => $result !== false,
            'message' => $result ? 'Role overridden!' : 'Error! Please check log for more details.',
        ]);
    }

    // DELETE /enpoint/:id
    public function delete($id)
    {
        $result = $this->getMarketSegmentModel()->delete($id);
        return new JsonModel([
            'success' => $result !== false,
            'message' => $result ? 'Role override deleted!' : 'Error! Please check log for more details.',
        ]);
    }
}
