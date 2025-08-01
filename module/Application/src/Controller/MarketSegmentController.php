<?php

namespace Application\Controller;

use Application\Model\MarketSegment;
use Psr\Container\ContainerInterface;

class MarketSegmentController extends BaseController
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
        $table = $this->getMarketSegmentModel()->all();
        return new JsonModel([
            'success' => true,
            'data' => iterator_to_array($table),
        ]);
    }

    // GET /enpoint/:id
    public function get($id)
    {
        $row = $this->getMarketSegmentModel()->find($id);
        if (! $row) {
            return $this->abort404();
        }

        return json_encode([
            'success' => true,
            'market_segment' => $row,
        ]);
    }

    // POST /enpoint
    public function create($data)
    {
        $result = $this->getMarketSegmentModel()->create($data);
        return json_encode([
            'success' => $result !== false,
            'message' => $result ? 'Market segment added!' : 'Error! Please check log for more details.',
        ]);
    }

    // PUT /enpoint/:id
    public function update($id, $data)
    {
        $result = $this->getMarketSegmentModel()->update($id, $data);
        return json_encode([
            'success' => $result !== false,
            'message' => $result ? 'Saved successfully!' : 'Error! Please check log for more details.',
        ]);
    }

    // DELETE /enpoint/:id
    public function delete($id)
    {
        $result = $this->getMarketSegmentModel()->delete($id);
        return json_encode([
            'success' => $result !== false,
            'message' => $result ? 'Deleted successfully!' : 'Error! Please check log for more details.',
        ]);
    }
}
