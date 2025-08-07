<?php

declare(strict_types=1);

namespace Application;

use Application\Config\Defaults;
use Laminas\Http\Response;
use Laminas\Mvc\MvcEvent;
use Laminas\Session\Container;
use Laminas\Session\SessionManager;
use Laminas\ModuleManager\Feature\ConfigProviderInterface;
use Laminas\Session\SaveHandler\SaveHandlerInterface;
use Application\Model\User;
use Application\Model\Location;
use Application\Session\UserSession;

class Module implements ConfigProviderInterface
{
    public function getConfig(): array
    {
        /** @var array $config */
        $config = include __DIR__ . '/../config/module.config.php';
        return $config;
    }

    public function onBootstrap(MvcEvent $e): void
    {
        $serviceManager = $e->getApplication()->getServiceManager();

        $sessionManager = $serviceManager->get(SessionManager::class);

        /** @var SaveHandlerInterface $saveHandler */
        $saveHandler = $serviceManager->get('SessionSaveHandler');

        $sessionManager->setSaveHandler($saveHandler);
        if (! $sessionManager->sessionExists()) {
            $sessionManager->start();
        }

        Container::setDefaultManager($sessionManager);

        $eventManager = $e->getApplication()->getEventManager();
        $eventManager->attach(MvcEvent::EVENT_DISPATCH, function (MvcEvent $e) {
            $route = $e->getRouteMatch();
            $routeName = $route ? $route->getMatchedRouteName() : null;

            if (in_array($routeName, ['login', 'logout'])) {
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
        }, 100);

        $session = new UserSession();
        $userData = $session->getUserData();

        if ($userData && !empty($userData['id'])) {
            $userModel = $serviceManager->get(User::class);
            $locationModel = $serviceManager->get(Location::class);

            $user = $userModel->fetchsalebyid($userData['id']);

            /** @var string @defaultCompany */
            $defaultCompany = $_GET['company'] ?? ($user['default_company'] ?? null);
            $company = $locationModel->fetchLocationIdFromCompany($defaultCompany);
            $locationId = $company['location_id'] ?? ($user['default_location_id'] ?? null);

            define('DEFAULT_COMPANY', $defaultCompany);
            define('DEFAULT_LOCATION_ID', $locationId);

            Defaults::set($defaultCompany, $locationId);
        }

        $eventManager->attach(MvcEvent::EVENT_DISPATCH, function (MvcEvent $e) {
            /** @var Response $response */
            $response = $e->getResponse();
            $headers = $response->getHeaders();

            $headers->addHeaderLine('Cache-Control', 'no-cache');
            $headers->addHeaderLine('Pragma', '');
            $headers->addHeaderLine('Expires', '');
            //$headers->addHeaderLine('Content-Type', 'charset=utf-8');

            $routeMatch = $e->getRouteMatch();

            if (! $routeMatch) {
                return;
            }

            /** @var string $controller */
            $controller = $routeMatch->getParam('controller');
            /** @var string $action */
            $action     = $routeMatch->getParam('action');

            $viewModel = $e->getViewModel();
            $viewModel->setVariable('currentController', $controller);
            $viewModel->setVariable('currentAction', $action);
        }, 100);
    }
}
