<?php

declare(strict_types=1);

namespace Application;

use Application\Config\Defaults;
use Application\Listener\AuthGuard;
use Laminas\Http\Request;
use Laminas\Http\Response;
use Laminas\Mvc\MvcEvent;
use Laminas\Session\Container;
use Laminas\Session\SessionManager;
use Laminas\ModuleManager\Feature\ConfigProviderInterface;
use Laminas\Session\SaveHandler\SaveHandlerInterface;
use Application\Model\User;
use Application\Model\Location;
use Application\Session\UserSession;
use Laminas\View\Model\ViewModel;

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

        $eventManager->attach(MvcEvent::EVENT_DISPATCH_ERROR, [$this, 'handleError']);
        $eventManager->attach(MvcEvent::EVENT_RENDER_ERROR, [$this, 'handleError']);

        $authGuard = $serviceManager->get(AuthGuard::class);
        $eventManager->attach(MvcEvent::EVENT_DISPATCH, $authGuard, 1000);

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

    public function handleError(MvcEvent $event): void
    {
        $error = $event->getError();

         /** @var Request $request */
        $request = $event->getRequest();

        /** @var Response $response */
        $response = $event->getResponse();

        // Detect Inertia request
        $isInertia = $request->getHeaders()->has('X-Inertia');

        if ($error === \Laminas\Mvc\Application::ERROR_EXCEPTION) {
            $exception = $event->getParam('exception');

            $props = [
                'status' => 500,
                'message' => 'Something went wrong on the server.',
                'display_exceptions' => true,
                'exception' => $exception ? [
                    'type' => get_class($exception),
                    'file' => $exception->getFile(),
                    'line' => $exception->getLine(),
                    'message' => $exception->getMessage(),
                    'trace' => $exception->getTraceAsString(),
                ] : null,
            ];

            $page = [
                'component' => 'error/exception',
                'props'     => $props,
                'url'       => $request->getUri()->getPath(),
                'version'   => null,
            ];

            if ($isInertia) {
                $response->getHeaders()->addHeaderLine('Content-Type', 'application/json');
                $response->getHeaders()->addHeaderLine('X-Inertia', 'true');
                $response->setStatusCode(500);
                $response->setContent(json_encode($page, JSON_UNESCAPED_UNICODE));
                $event->setResult($response);
            } else {
                $viewModel = $event->getViewModel();
                $viewModel->setVariable('page', $page);
                $event->setResult($viewModel);
            }

            $event->stopPropagation();
        }

        // else: not exception
        if (
            $error !== \Laminas\Mvc\Application::ERROR_ROUTER_NO_MATCH &&
            $error !== \Laminas\Mvc\Application::ERROR_CONTROLLER_NOT_FOUND &&
            $error !== \Laminas\Mvc\Application::ERROR_CONTROLLER_INVALID &&
            $error !== \Laminas\Mvc\Application::ERROR_CONTROLLER_CANNOT_DISPATCH
        ) {
            return;
        }

        $reason = match ($error) {
            \Laminas\Mvc\Application::ERROR_CONTROLLER_CANNOT_DISPATCH =>
            'The requested controller was unable to dispatch the request.',
            \Laminas\Mvc\Application::ERROR_CONTROLLER_NOT_FOUND =>
            'The requested controller could not be mapped to an existing controller class.',
            \Laminas\Mvc\Application::ERROR_CONTROLLER_INVALID =>
            'The requested controller was not dispatchable.',
            \Laminas\Mvc\Application::ERROR_ROUTER_NO_MATCH =>
            'The requested URL could not be matched by routing.',
        };

        $props = [
            'status'  => 404,
            'message' => "Uh-oh! The page you're looking for seems to have wandered off. Maybe it's hiding… or maybe it never existed. Below is the reason:",
            'reason'  => $reason,
        ];

        $page = [
            'component' => 'error/404',
            'props'     => $props,
            'url'       => $request->getUri()->getPath(),
            'version'   => null,
        ];

        if ($isInertia) {
            $response->getHeaders()->addHeaderLine('Content-Type', 'application/json');
            $response->getHeaders()->addHeaderLine('Vary', 'X-Inertia');
            $response->getHeaders()->addHeaderLine('X-Inertia', 'true');
            $response->setStatusCode(404);
            $response->setContent(json_encode($page, JSON_UNESCAPED_UNICODE));

            $event->setResult($response);
            $event->stopPropagation();
            return;
        }

        // Initial Inertia load (server-side render of the app shell)
        $layout = $event->getViewModel();
        $layout->setVariable('page', $page);

        $event->setResult($layout);
        $event->stopPropagation();
    }

    public function handleAppearance(MvcEvent $event): void
    {
        /** @var Request $request */
        $request = $event->getRequest();

        $cookieTheme = null;
        $cookies = $request->getCookie();

        if ($cookies) {
            $cookieTheme = $cookies['appearance'] ?? 'system';
        }

        $viewModel = $event->getViewModel();
        $viewModel->setVariable('appearance', $cookieTheme);
    }
}
