<?php

namespace Application\Listener;

use Application\Session\UserSession;
use Laminas\Http\Response;
use Laminas\Mvc\MvcEvent;

class AuthGuard
{
    protected array $excludedRoutes = ['login', 'logout'];

    public function __invoke(MvcEvent $e)
    {
        $routeMatch = $e->getRouteMatch();
        $routeName = $routeMatch?->getMatchedRouteName();

        if (in_array($routeName, $this->excludedRoutes, true)) {
            return;
        }

        $session = new UserSession();
        $user = $session->getUserData();

        if (! $user || empty($user['id'])) {
            // User not logged in — redirect to login

            $request = $e->getRequest();

            if ($request instanceof \Laminas\Http\PhpEnvironment\Request && $request->isXmlHttpRequest()) {
                /** @var Response $response */
                $response = $e->getResponse();
                $response->setStatusCode(401);
                $response->setContent('{"error":"Unauthorized"}');
                $response->getHeaders()->addHeaderLine('Content-Type', 'application/json');
                $e->stopPropagation(true);
                return $response;
            }


            /** @var Response $response */
            $response = $e->getResponse();
            $response->getHeaders()->addHeaderLine('Location', '/login');
            $response->setStatusCode(302);
            $e->stopPropagation(true);
            return $response;
        }
    }
}
