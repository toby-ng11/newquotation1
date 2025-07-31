<?php

namespace Application\Controller;

use Application\Model\RoleOverride;
use Laminas\View\Model\JsonModel;
use Psr\Container\ContainerInterface;

class RoleOverrideController extends BaseController
{
    protected $container;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    public function getRoleOverrideModel(): RoleOverride
    {
        return $this->container->get(RoleOverride::class);
    }

    // GET /role-override
    public function getList()
    {
        $table = $this->getRoleOverrideModel()->fetchAll();
        return new JsonModel([
            'success' => true,
            'data' => iterator_to_array($table),
        ]);
    }

    // GET /role-override/:id
    public function get($id)
    {
        $row = $this->getRoleOverrideModel()->find($id);
        if (! $row) {
            return $this->abort404();
        }

        return new JsonModel([
            'success' => true,
            'role_override' => $row,
        ]);
    }

    // POST /role-override
    public function create($data)
    {
        $result = $this->getRoleOverrideModel()->create($data);
        return new JsonModel([
            'success' => $result !== false,
            'message' => $result ? 'Role overridden!' : 'Error! Please check log for more details.',
        ]);
    }

    // PUT /role-override/:id
    public function update($id, $data)
    {
        $result = $this->getRoleOverrideModel()->update($id, $data);
        return new JsonModel([
            'success' => $result !== false,
            'message' => $result ? 'Role overridden!' : 'Error! Please check log for more details.',
        ]);
    }

    // DELETE /role-override/:id
    public function delete($id)
    {
        $result = $this->getRoleOverrideModel()->delete($id);
        return new JsonModel([
            'success' => $result !== false,
            'message' => $result ? 'Role override deleted!' : 'Error! Please check log for more details.',
        ]);
    }
}
