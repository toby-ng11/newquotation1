<?php

namespace Application\Controller\Api;

use Laminas\Http\Response;
use Laminas\View\Model\ViewModel;
use Psr\Container\ContainerInterface;

class UserController extends ApiController
{
    public function __construct(ContainerInterface $container)
    {
        parent::__construct($container);
    }

    public function meAction()
    {
        $user = $this->getUserService()->getCurrentUser();

        if (! $user) {
            return $this->json(['error' => 'Unauthorized',]);
        }

        return $this->json([
            'id'         => $user['id'],
            'first_name' => $user['first_name'],
            'last_name'  => $user['last_name'],
            'email'      => $user['email_address'],
            'role'       => $user['role'],
            'p2q_system_role' => $user['p2q_system_role'],
        ]);
    }

    public function usersAction(): Response | ViewModel
    {
        $request = $this->getRequest();
        if (!$this->expectsJson($request)) {
            return $this->abort404();
        }

        $pattern = $this->params()->fromQuery('pattern', '');
        $limit = (int) $this->params()->fromQuery('limit', 10);

        if (empty($pattern)) {
            return $this->json(['error' => 'Pattern is required']);
        }

        $users = $this->getUserModel()->fetchUserIdByPattern($pattern, $limit);
        return $this->json($users);
    }
}
