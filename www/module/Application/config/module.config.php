<?php

declare(strict_types=1);

namespace Application;

use Laminas\Mvc\Application;
use Laminas\Router\Http\Literal;
use Laminas\Router\Http\Segment;
use Laminas\ServiceManager\Factory\InvokableFactory;
use Laminas\Db\TableGateway\TableGateway;

return [
    'router' => [
        'routes' => [
            'admin' => [
                'type' => Segment::class,
                'options' => [
                    'route'    => '/index/admin[/:action]',
                    'constraints' => [
                        'action' => 'project|quote',
                    ],
                    'defaults' => [
                        'controller' => Controller\IndexController::class,
                        'action'     => 'admin',
                    ],
                ],
            ],
        ],
    ],
    'controllers' => [
        'factories' => [
            Controller\IndexController::class => function ($container) {
                return new Controller\IndexController(
                    $container->get(Service\UserService::class),
                    $container->get(Model\Project::class),
                    $container->get(Model\Quote::class)
                );
            },
        ],
    ],
    'view_manager' => [
        'display_not_found_reason' => true,
        'display_exceptions'       => true,
        'layout'                   => 'layout/default',
        'doctype'                  => 'HTML5',
        'not_found_template'       => 'error/404',
        'exception_template'       => 'error/index',
        'template_map' => [
            'layout/layout'           => __DIR__ . '/../view/layout/default.phtml',
            'application/index/index' => __DIR__ . '/../view/application/index/index.phtml',
            'application/index/admin' => __DIR__ . '/../view/application/index/admin.phtml',
            'error/404'               => __DIR__ . '/../view/error/404.phtml',
            'error/index'             => __DIR__ . '/../view/error/index.phtml',
        ],
        'template_path_stack' => [
            __DIR__ . '/../view',
        ],
        'strategies' => [
            'ViewJsonStrategy',
        ],
    ],
    'view_helpers' => [
        'factories' => [
            View\Helper\UserHelper::class => InvokableFactory::class,
        ],
        'aliases' => [
            'userHelper' => View\Helper\UserHelper::class,
        ],
    ],
    'service_manager' => [
        'factories' => [
            Service\UserService::class => function ($container) {
                return new Service\UserService(
                    $container->get(Model\User::class)
                );
            },
            Model\User::class => function ($container) {
                $dbAdapter = $container->get('Laminas\Db\Adapter\Adapter');
                $tableGateway = new TableGateway('P21_Users', $dbAdapter);
                return new Model\User($tableGateway);
            },
            Model\Project::class => function ($container) {
                $dbAdapter = $container->get('Laminas\Db\Adapter\Adapter');
                return new Model\Project(
                    new TableGateway('project', $dbAdapter),
                    new TableGateway('p2q_view_project', $dbAdapter),
                );
            },
            Model\Quote::class => function ($container) {
                $dbAdapter = $container->get('Laminas\Db\Adapter\Adapter');
                return new Model\Quote(
                    new TableGateway('quote', $dbAdapter),
                    new TableGateway('p2q_view_quote_x_project_x_oe', $dbAdapter),
                );
            },
        ],
    ],
];
