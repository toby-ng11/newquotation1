<?php

namespace Application\Controller;

use Psr\Container\ContainerInterface;

class RoleOverrideController extends BaseController
{
    public function __construct(ContainerInterface $container)
    {
        parent::__construct($container);
    }

    // GET /role-override
    public function getList()
    {
        $table = $this->getRoleOverrideModel()->all();
        return $this->json([
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

        return $this->json([
            'success' => true,
            'role_override' => $row,
        ]);
    }

    // POST /role-override
    public function create($data)
    {
        $result = $this->getRoleOverrideModel()->create($data);
        return $this->json([
            'success' => $result !== false,
            'message' => $result !== false ? 'Role overridden!' : 'Error! Please check log for more details.',
        ]);
    }

    // PUT /role-override/:id
    public function update($id, $data)
    {
        $result = $this->getRoleOverrideModel()->update($id, $data);
        return $this->json([
            'success' => $result !== false,
            'message' => $result !== false ? 'Role overridden!' : 'Error! Please check log for more details.',
        ]);
    }

    // DELETE /role-override/:id
    public function delete($id)
    {
        $result = $this->getRoleOverrideModel()->delete($id);
        return $this->json([
            'success' => $result !== false,
            'message' => $result !== false ? 'Role override deleted!' : 'Error! Please check log for more details.',
        ]);
    }
}
