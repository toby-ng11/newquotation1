<?php

declare(strict_types=1);

namespace Application;

use Laminas\Mvc\MvcEvent;
use Laminas\Session\Container;
use Laminas\Session\SessionManager;
use Laminas\ModuleManager\Feature\ConfigProviderInterface;
use Application\Model\User;
use Application\Model\Location;

class Module implements ConfigProviderInterface
{
    public function getConfig(): array
    {
        /** @var array $config */
        $config = include __DIR__ . '/../config/module.config.php';
        return $config;
    }

    public function onBootstrap(MvcEvent $e)
    {
        $serviceManager = $e->getApplication()->getServiceManager();

        // Initialize session
        $sessionManager = $serviceManager->get(SessionManager::class);
        Container::setDefaultManager($sessionManager);

        $userModel = $serviceManager->get(User::class);
        $locationModel = $serviceManager->get(Location::class);
        $name = str_replace(['CENTURA\\', 'centura\\'], '', $_SERVER['REMOTE_USER'] ?? '');
        $user = $userModel->fetchsalebyid($name);

        $default_company = $_GET['company'] ?? ($user['default_company'] ?? null);
        $company = $locationModel->fetchLocationIdFromCompany($default_company);
        $location_id = $company['location_id'] ?? ($user['default_location_id'] ?? null);

        define("DEFAULT_COMPANY", $default_company);
        define("DEFAULT_LOCATION_ID", $location_id);

        $e->getApplication()->getEventManager()->attach(MvcEvent::EVENT_DISPATCH, function ($e) {
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

            $controller = $routeMatch->getParam('controller');
            $action     = $routeMatch->getParam('action');

            $viewModel = $e->getViewModel();
            $viewModel->setVariable('currentController', $controller);
            $viewModel->setVariable('currentAction', $action);
        }, 100);
    }

    public function getServiceConfig()
    {
        return [
            'factories' => [
                Service\UserService::class => function ($container) {
                    return new Service\UserService(
                        $container->get(Model\User::class) // Inject User model
                    );
                },
            ],
        ];
    }
}
