<?php

declare(strict_types=1);

namespace Application;

use Application\Model\RoleOverride;
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
            'sidebar' => [
                'type' => Segment::class,
                'options' => [
                    'route' => '/sidebar[/:action][/:id]',
                    'constraints' => [
                        'action' => '[a-zA-Z][a-zA-Z0-9_-]*',
                        'id' => '[0-9]*',
                    ],
                    'defaults' => [
                        'controller' => Controller\SidebarController::class,
                        'action' => 'home',
                    ],
                ],
            ],
            'dashboard' => [
                'type' => Segment::class,
                'options' => [
                    'route'    => '/index[/:action][/:table]',
                    'constraints' => [
                        'action' => '[a-zA-Z][a-zA-Z0-9_-]*',
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
                'may_terminate' => true,
                'child_routes' => [
                    'new' => [
                        'type' => Literal::class,
                        'options' => [
                            'route' => '/new',
                            'defaults' => [
                                'action' => 'new',
                            ]
                        ],
                    ]
                ]
            ],
            'project-share' => [
                'type' => Segment::class,
                'options' => [
                    'route'    => '/projectshare[/:id[/:action]]',
                    'defaults' => [
                        'controller' => Controller\ProjectShareController::class,
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
                    'route'    => '/customer[/:id[/:action]]',
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
                    'route'    => '/architect[/:id[/:action]]',
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
                    'route'    => '/item[/:id[/:action]]',
                    'constraints' => [
                        'action' => '[a-zA-Z][a-zA-Z0-9_-]*',
                        'id'     => '[a-zA-Z0-9_-]+',
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
                    'route'    => '/note[/:id[/:action]]',
                    'constraints' => [
                        'action' => '[a-zA-Z][a-zA-Z0-9_-]*',
                        'id'     => '[0-9]+',
                    ],
                    'defaults' => [
                        'controller' => Controller\NoteController::class,
                        'action'     => 'index',
                    ],
                ],
            ],
            'address' => [
                'type' => Segment::class,
                'options' => [
                    'route'    => '/addresses[/:id[/:action]]',
                    'constraints' => [
                        'action' => '[a-zA-Z][a-zA-Z0-9_-]*',
                        'id'     => '[0-9]+',
                    ],
                    'defaults' => [
                        'controller' => Controller\AddressController::class,
                        'action'     => 'index',
                    ],
                ],
            ],
            'specifier' => [
                'type' => Segment::class,
                'options' => [
                    'route'    => '/specifiers[/:id[/:action]]',
                    'constraints' => [
                        'action' => '[a-zA-Z][a-zA-Z0-9_-]*',
                        'id'     => '[0-9]+',
                    ],
                    'defaults' => [
                        'controller' => Controller\SpecifierController::class,
                        'action'     => 'index',
                    ],
                ],
            ],
            'opportunity' => [
                'type' => Literal::class,
                'options' => [
                    'route'    => '/opportunities',
                    'defaults' => [
                        'controller' => Controller\OpportunityController::class,
                        'action'     => 'index',
                    ],
                ],
                'may_terminate' => true,
                'child_routes' => [
                    'new' => [
                        'type' => Literal::class,
                        'options' => [
                            'route' => '/new',
                            'defaults' => [
                                'action' => 'new',
                            ]
                        ],
                    ]
                ]
            ],
            'role-override' => [
                'type' => Segment::class,
                'options' => [
                    'route'    => '/role-override[/:id]',
                    'constraints' => [
                        'id' => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ],
                    'defaults' => [
                        'controller' => Controller\RoleOverrideController::class,
                    ],
                ],
            ],
            'api' => [
                'type' => Literal::class,
                'options' => [
                    'route' => '/api',
                    'constraints' => [
                        'key' => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ],
                    'defaults' => [
                        'controller' => Controller\Api\ApiController::class,
                        'action' => 'index',
                    ],
                ],
                'may_terminate' => true,
                'child_routes' => [
                    'api-preferences' => [
                        'type' => Segment::class,
                        'options' => [
                            'route' => '/preferences[/:key]',
                            'constraints' => [
                                'key' => '[a-zA-Z][a-zA-Z0-9_-]*',
                            ],
                            'defaults' => [
                                'controller' => Controller\Api\PreferenceController::class,
                                'action' => 'index',
                            ]
                        ],
                    ],
                    'api-user' => [
                        'type' => Literal::class,
                        'options' => [
                            'route'    => '/user',
                            'defaults' => [
                                'controller' => Controller\Api\UserController::class,
                                'action'     => 'me',
                            ],
                        ],
                    ],
                ]
            ],
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
                    $container->get(Model\Architect::class),
                    $container
                );
            },
            Controller\SidebarController::class => function ($container) {
                return new Controller\SidebarController(
                    $container->get(Service\UserService::class)
                );
            },
            Controller\ProjectController::class => function ($container) {
                return new Controller\ProjectController(
                    $container->get(Service\UserService::class),
                    $container->get(Service\PdfExportService::class),
                    $container->get(Model\Project::class),
                    $container->get(Model\Location::class),
                    $container->get(Model\Item::class),
                    $container->get(Model\Note::class),
                    $container->get(Model\Architect::class),
                    $container->get(Model\Address::class),
                    $container->get(Model\Specifier::class),
                    $container->get(Model\Customer::class),
                    $container->get(Model\ProjectShare::class)
                );
            },
            Controller\ProjectShareController::class => function ($container) {
                return new Controller\ProjectShareController(
                    $container->get(Model\ProjectShare::class),
                    $container
                );
            },
            Controller\QuoteController::class => function ($container) {
                return new Controller\QuoteController(
                    $container
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
                    $container->get(Service\UserService::class),
                    $container->get(Model\Architect::class),
                    $container->get(Model\Address::class),
                    $container->get(Model\Specifier::class),
                    $container->get(Model\Location::class),
                    $container->get(Model\Project::class)
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
            },
            Controller\SpecifierController::class => function ($container) {
                return new Controller\SpecifierController(
                    $container->get(Model\Specifier::class)
                );
            },
            Controller\AddressController::class => function ($container) {
                return new Controller\AddressController(
                    $container->get(Model\Address::class)
                );
            },
            Controller\RoleOverrideController::class => function ($container) {
                return new Controller\RoleOverrideController(
                    $container
                );
            },
            Controller\Api\PreferenceController::class => function ($container) {
                return new Controller\Api\PreferenceController(
                    $container->get(Service\UserService::class),
                    $container->get(Model\UserPreferenceTable::class),
                );
            },
            Controller\Api\UserController::class => function ($container) {
                return new Controller\Api\UserController(
                    $container->get(Service\UserService::class),
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
            Model\UserPreferenceTable::class => function ($container) {
                $dbAdapter = $container->get('Laminas\Db\Adapter\Adapter');
                return new Model\UserPreferenceTable(
                    new TableGateway('user_preferences', $dbAdapter)
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
                    new TableGateway('architects', $dbAdapter),
                    $container
                );
            },
            Model\Specifier::class => function ($container) {
                $dbAdapter = $container->get('Laminas\Db\Adapter\Adapter');
                return new Model\Specifier(
                    $dbAdapter,
                    new TableGateway('specifiers', $dbAdapter),
                    $container,
                );
            },
            Model\Address::class => function ($container) {
                $dbAdapter = $container->get('Laminas\Db\Adapter\Adapter');
                return new Model\Address(
                    $dbAdapter,
                    new TableGateway('addresses', $dbAdapter),
                    $container
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
                    new TableGateway('projects', $dbAdapter),
                    new TableGateway('p2q_view_projects', $dbAdapter),
                    new TableGateway('p2q_view_projects_lite', $dbAdapter),
                    new TableGateway('p2q_view_projects_share', $dbAdapter),
                    $container
                );
            },
            Model\ProjectShare::class => function ($container) {
                $dbAdapter = $container->get('Laminas\Db\Adapter\Adapter');
                return new Model\ProjectShare(
                    $dbAdapter,
                    new TableGateway('project_shares', $dbAdapter),
                    $container
                );
            },
            Model\Quote::class => function ($container) {
                $dbAdapter = $container->get('Laminas\Db\Adapter\Adapter');
                return new Model\Quote(
                    $dbAdapter,
                    new TableGateway('quotes', $dbAdapter),
                    new TableGateway('p2q_view_quote_x_project_x_oe', $dbAdapter),
                    $container
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
                    new TableGateway('project_notes', $dbAdapter)
                );
            },
            Model\View\P21User::class => function ($container) {
                $dbAdapter = $container->get('Laminas\Db\Adapter\Adapter');
                return new Model\View\P21User(
                    new TableGateway('P21_Users', $dbAdapter),

                );
            },
            Service\MailerService::class => function ($container) {
                $config = $container->get('config');
                $twig = $container->get(\Twig\Environment::class);

                return new Service\MailerService(
                    $config['mailer']['dsn'],
                    $config['mailer']['from'],
                    $twig,
                );
            },
            \Twig\Environment::class => function ($container) {
                $loader = new \Twig\Loader\FilesystemLoader([
                    __DIR__ . '/../view/email',
                ]);
                $twig = new \Twig\Environment($loader, [
                    'cache' => false, // Set a writable path like '/data/cache/twig' in production
                    'auto_reload' => true,
                ]);
                return $twig;
            }
        ],
    ],
];
