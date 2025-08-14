<?php

namespace Application\Controller;

use Application\Service\LdapAuthService;
use Application\Session\UserSession;
use Laminas\Http\Response;
use Laminas\Session\Container;
use Laminas\Session\Validator\Csrf;
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

        $session = new Container();
        $validator = new Csrf(['session' => $session]);
        $hash = $validator->getHash();

        if ($request->isPost()) {
            $rawBody = $request->getContent();
            $data = json_decode($rawBody, true) ?: [];

            $token = $data['_token'] ?? null;

            if (! $validator->isValid($token)) {
                $this->share([
                    'errors' => ['login_error' => 'Session timeouted. Please refresh the page.'],
                ]);
                return $this->redirect()->toRoute('login');
            }

            $username = trim($data['username']);
            $password = $data['password'];

            if ($username === '') {
                $this->share([
                    'errors' => ['username' => 'Username is required.'],
                ]);
                return $this->redirect()->toRoute('login');
            }

            $result = $this->authService->authenticate($username, $password);

            if ($result) {
                $session = new UserSession();
                $session->setUserData([
                    'id' => $username,
                    'name' => $username,
                ]);

                return $this->redirect()->toUrl('/');
            }

            $this->share([
                'errors' => ['login_error' => 'Invalid credentials.'],
            ]);
            $response = $this->redirect()->toRoute('login');
            return $response;
        }

        return $this->render('auth/login', [
            'csrf' => $hash,
        ]);
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

        $response = $this->redirect()->toRoute('login');
        $response->setStatusCode(303);

        return $response;
    }
}
