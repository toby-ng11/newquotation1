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
            'home' => [
                'type' => Literal::class,
                'options' => [
                    'route'    => '/',
                    'defaults' => [
                        'controller' => Controller\IndexController::class,
                        'action'     => 'index',
                    ],
                ],
            ],
            'dashboard' => [
                'type' => Segment::class,
                'options' => [
                    'route'    => '/index[/:action][/:table]',
                    'constraints' => [
                        'action' => 'project|approval|admin|architect',
                        'table' => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ],
                    'defaults' => [
                        'controller' => Controller\IndexController::class,
                        'action'     => 'index',
                    ],
                ],
            ],
            'project' => [
                'type' => Segment::class,
                'options' => [
                    'route'    => '/project[/:id[/:action]]',
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
            'quote' => [
                'type' => Segment::class,
                'options' => [
                    'route'    => '/quote[/:id[/:action]]',
                    'defaults' => [
                        'controller' => Controller\QuoteController::class,
                        'action'     => 'index',
                    ],
                    'constraints' => [
                        'id' => '[0-9]+',
                        'action' => '[a-zA-Z][a-zA-Z0-9_-]*',
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
                ],
            ],
            'item' => [
                'type' => Segment::class,
                'options' => [
                    'route'    => '/item[/:action]',
                    'constraints' => [
                        'action' => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ],
                    'defaults' => [
                        'controller' => Controller\ItemController::class,
                        'action'     => 'index',
                    ],
                ],
            ],
            'note' => [
                'type' => Segment::class,
                'options' => [
                    'route'    => '/note[/:action]',
                    'constraints' => [
                        'action' => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ],
                    'defaults' => [
                        'controller' => Controller\NoteController::class,
                        'action'     => 'index',
                    ],
                ],
            ]
        ],
    ],
    'controllers' => [
        'factories' => [
            Controller\IndexController::class => function ($container) {
                return new Controller\IndexController(
                    $container->get(Service\UserService::class),
                    $container->get(Model\Project::class),
                    $container->get(Model\Quote::class),
                    $container->get(Model\Note::class),
                );
            },
            Controller\ProjectController::class => function ($container) {
                return new Controller\ProjectController(
                    $container->get(Service\UserService::class),
                    $container->get(Model\Project::class),
                    $container->get(Model\Location::class),
                    $container->get(Model\Item::class),
                    $container->get(Model\Note::class),
                    $container->get(Model\Architect::class),
                    $container->get(Model\Specifier::class),
                    $container->get(Model\Customer::class)
                );
            },
            Controller\QuoteController::class => function ($container) {
                return new Controller\QuoteController(
                    $container->get(Service\UserService::class),
                    $container->get(Model\Quote::class),
                    $container->get(Model\Project::class),
                    $container->get(Model\Location::class),
                    $container->get(Model\Item::class),
                    $container->get(Model\Customer::class)
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
            Controller\ArchitectController::class => function ($container) {
                return new Controller\ArchitectController(
                    $container->get(Model\Architect::class),
                    $container->get(Model\Specifier::class)
                );
            },
            Controller\ItemController::class => function ($container) {
                return new Controller\ItemController(
                    $container->get(Model\Item::class)
                );
            },
            Controller\NoteController::class => function ($container) {
                return new Controller\NoteController(
                    $container->get(Model\Note::class)
                );
            }
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
            'layout/nonheader'        => __DIR__ . '/../view/layout/nonheader.phtml',
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
            Model\Specifier::class => function ($container) {
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
                    $dbAdapter,
                    new TableGateway('quote', $dbAdapter),
                    new TableGateway('p2q_view_quote_x_project_x_oe', $dbAdapter),
                    $container->get(Service\UserService::class),
                    $container->get(Model\Project::class),
                    $container->get(Model\Item::class)
                );
            },
            Model\Item::class => function ($container) {
                $dbAdapter = $container->get('Laminas\Db\Adapter\Adapter');
                return new Model\Item(
                    $dbAdapter,
                    $container->get(Service\UserService::class),
                    new TableGateway('project_items', $dbAdapter),
                    new TableGateway('quote_items', $dbAdapter),
                );
            },
            Model\Note::class => function ($container) {
                $dbAdapter = $container->get('Laminas\Db\Adapter\Adapter');
                return new Model\Note(
                    $dbAdapter,
                    $container->get(Service\UserService::class),
                    new TableGateway('project_note', $dbAdapter)
                );
            }
        ],
    ],
];
