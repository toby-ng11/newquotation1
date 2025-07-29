<?php

namespace Application\Controller\Api;

use Application\Service\UserService;
use Laminas\View\Model\JsonModel;

class UserController extends ApiController
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function meAction() {
        $user = $this->userService->getCurrentUser();

        if (! $user) {
            return new JsonModel(['error' => 'Unauthorized',]);
        }

        return new JsonModel([
            'id'         => $user['id'],
            'first_name' => $user['first_name'],
            'last_name'  => $user['last_name'],
            'email'      => $user['email'],
            'role'       => $user['role'],
            'p2q_system_role' => $user['p2q_system_role'],
        ]);
    }
}
