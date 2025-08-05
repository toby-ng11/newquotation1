<?php

namespace Application\Controller;

use InvalidArgumentException;
use Psr\Container\ContainerInterface;

class MarketSegmentController extends BaseController
{
    public function __construct(ContainerInterface $container)
    {
        parent::__construct($container);
    }

    // GET /endpoint
    public function getList()
    {
        $table = $this->getMarketSegmentModel()->all();
        return $this->json([
            'success' => true,
            'data' => $table,
        ]);
    }

    // GET /endpoint/:id
    public function get(mixed $id)
    {
        $row = $this->getMarketSegmentModel()->find($id);
        if (! $row) {
            return $this->abort404();
        }

        return $this->json([
            'success' => true,
            'market_segment' => $row,
        ]);
    }

    // POST /endpoint
    public function create(mixed $data)
    {
        if (! is_array($data)) {
            throw new InvalidArgumentException('Expected array in create()');
        }

        $result = $this->getMarketSegmentModel()->create($data);
        return $this->json([
            'success' => $result !== false,
            'message' => $result !== false ? 'Market segment added!' : 'Error! Please check log for more details.',
        ]);
    }

    // PUT /endpoint/:id
    public function update(mixed $id, mixed $data)
    {
        if (! is_array($data) || ! is_int($id)) {
            throw new InvalidArgumentException('Unexpected params type in update()');
        }

        $result = $this->getMarketSegmentModel()->update($id, $data);
        return $this->json([
            'success' => $result !== false,
            'message' => $result ? 'Saved successfully!' : 'Error! Please check log for more details.',
        ]);
    }

    // DELETE /endpoint/:id
    public function delete(mixed $id)
    {
        $result = $this->getMarketSegmentModel()->delete($id);
        return $this->json([
            'success' => $result !== false,
            'message' => $result ? 'Deleted successfully!' : 'Error! Please check log for more details.',
        ]);
    }
}
