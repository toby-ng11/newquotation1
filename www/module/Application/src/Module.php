<?php

declare(strict_types=1);

namespace Application;

use Laminas\Mvc\MvcEvent;
use Laminas\Session\Container;
use Laminas\Session\SessionManager;
use Laminas\ModuleManager\Feature\ConfigProviderInterface;

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
