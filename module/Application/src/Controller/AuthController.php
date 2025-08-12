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

        return $this->inertia('auth/login');
    }

    public function logoutAction(): Response
    {
        $request = $this->getRequest();
        if (! $request->isPost()) {
            $response = $this->getResponse();
            $response->setStatusCode(405);
            $response->getHeaders()->addHeaderLine('Allow', 'POST');
            return $response;
        }

        //$token = $this->params()->fromPost('_token');
        // if (! $this->csrf->isValid($token)) { return $this->getResponse()->setStatusCode(400); }

        $session = new UserSession();

        // Destroy session
        $manager = $session->getManager();

        /** @var string $id */
        $id = $manager->getId();

        $manager->getSaveHandler()->destroy($id);
        $manager->destroy();

        $response = $this->redirect()->toUrl('/login');
        $response->setStatusCode(303);

        return $response;
    }
}
