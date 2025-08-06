<?php

namespace Application\Controller;

use Application\Service\LdapAuthService;
use Application\Session\UserSession;
use Laminas\Http\Response;
use Laminas\View\Model\ViewModel;

class AuthController extends BaseController
{
    /** @var LdapAuthService $authService */
    protected $authService;

    public function __construct(LdapAuthService $authService)
    {
        $this->authService = $authService;
    }

    public function loginAction(): Response|ViewModel
    {
        $request = $this->getRequest();

        if ($request->isPost()) {
            /** @var string $username */
            $username = $request->getPost('username');

            /** @var string $password */
            $password = $request->getPost('password');

            $result = $this->authService->authenticate($username, $password);

            if ($result) {
                $session = new UserSession();
                $session->setUserData([
                    'id' => $username,
                    'name' => $username,
                ]);

                return $this->redirect()->toRoute('home');
            }

            return $this->json([
                'error' => 'Invalid credentials.',
            ], 401);
        }

        $this->layout()->setTemplate('layout/react');
        $view = new ViewModel();
        return $view;
    }

    public function logoutAction()
    {
        $session = new UserSession();

        // Destroy session
        $manager = $session->getManager();
        $manager->getSaveHandler()->destroy($manager->getId());
        $manager->destroy();

        // Optional: clear just the session container if you want a soft logout
        // $session->exchangeArray([]);

        return $this->redirect()->toRoute('login');
    }
}
