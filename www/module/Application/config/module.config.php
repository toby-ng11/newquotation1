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
            'project' => [
                'type' => Segment::class,
                'options' => [
                    'route'    => '/project[/:action][/id/:id]',
                    'defaults' => [
                        'controller' => Controller\ProjectController::class,
                        'action'     => 'index',
                    ],
                    'constraints' => [
                        'action' => '[a-zA-Z][a-zA-Z0-9_-]*',
                        'id'     => '[0-9]+',
                    ]
                ],
            ],
            'user' => [
                'type' => Segment::class,
                'options' => [
                    'route'    => '/user[/:action]',
                    'defaults' => [
                        'controller' => Controller\UserController::class,
                        'action'     => 'index',
                    ],
                ],
            ],
            'customer' => [
                'type' => Segment::class,
                'options' => [
                    'route'    => '/customer[/:action][/id/:id]',
                    'constraints' => [
                        'action' => '[a-zA-Z][a-zA-Z0-9_-]*',
                        'id'     => '[0-9]+',
                    ],
                    'defaults' => [
                        'controller' => Controller\CustomerController::class,
                        'action'     => 'index',
                    ],
                ],
            ],
            'architect' => [
                'type' => Segment::class,
                'options' => [
                    'route'    => '/architect[/:action][/id/:id]',
                    'constraints' => [
                        'action' => '[a-zA-Z][a-zA-Z0-9_-]*',
                        'id'     => '[0-9]+',
                    ],
                    'defaults' => [
                        'controller' => Controller\ArchitectController::class,
                        'action'     => 'index',
                    ],
                ]
            ]
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
            Controller\ProjectController::class => function ($container) {
                return new Controller\ProjectController(
                    $container->get(Service\UserService::class),
                    $container->get(Model\Project::class),
                    $container->get(Model\Location::class)
                );
            },
            Controller\UserController::class => function ($container) {
                return new Controller\UserController(
                    $container->get('Laminas\Db\Adapter\Adapter'),
                    $container->get(Model\User::class)
                );
            },
            Controller\CustomerController::class => function ($container) {
                return new Controller\CustomerController(
                    $container->get(Model\Customer::class)
                );
            },
            Controller\ArchitectController::class => function
            ($container) {
                return new Controller\ArchitectController(
                    $container->get(Model\Architect::class)
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
            'ViewJsonStrategy', // be sure to add this strategy for JSON responses
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
                return new Model\User(
                    $dbAdapter,
                    new TableGateway('P21_Users', $dbAdapter)
                );
            },
            Model\Location::class => function ($container) {
                $dbAdapter = $container->get('Laminas\Db\Adapter\Adapter');
                return new Model\Location(
                    new TableGateway('P21_Location_x_Branch', $dbAdapter)
                );
            },
            Model\Architect::class => function ($container) {
                $dbAdapter = $container->get('Laminas\Db\Adapter\Adapter');
                return new Model\Architect(
                    $dbAdapter,
                    new TableGateway('architect', $dbAdapter),
                    $container->get(Model\Address::class)
                );
            },
            Model\Specifier::class =>function ($container) {
                $dbAdapter = $container->get('Laminas\Db\Adapter\Adapter');
                return new Model\Specifier(
                    $dbAdapter,
                    new TableGateway('specifier', $dbAdapter),
                    $container->get(Model\Address::class)
                );
            },
            Model\Address::class => function ($container) {
                $dbAdapter = $container->get('Laminas\Db\Adapter\Adapter');
                return new Model\Address(
                    $dbAdapter,
                    new TableGateway('address', $dbAdapter)
                );
            },
            Model\Customer::class => function ($container) {
                $dbAdapter = $container->get('Laminas\Db\Adapter\Adapter');
                return new Model\Customer(
                    $dbAdapter,
                    new TableGateway('P21_customers_x_address', $dbAdapter),
                    new TableGateway('P21_customers_x_address_x_contacts', $dbAdapter)
                );
            },
            Model\Project::class => function ($container) {
                $dbAdapter = $container->get('Laminas\Db\Adapter\Adapter');
                return new Model\Project(
                    $dbAdapter,
                    new TableGateway('project', $dbAdapter),
                    new TableGateway('p2q_view_project', $dbAdapter),
                    $container->get(Model\Architect::class),
                    $container->get(Model\Specifier::class)
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
