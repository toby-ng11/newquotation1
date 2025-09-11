<?php

declare(strict_types=1);

namespace Application;

use Laminas\Db\Adapter\Adapter;
use Laminas\Router\Http\Literal;
use Laminas\Router\Http\Segment;
use Laminas\ServiceManager\Factory\InvokableFactory;
use Laminas\Db\TableGateway\TableGateway;
use Psr\Container\ContainerInterface;

return [
    'router' => [
        'routes' => [
            'login' => [
                'type' => Literal::class,
                'options' => [
                    'route' => '/login',
                    'defaults' => [
                        'controller' => Controller\AuthController::class,
                        'action' => 'login',
                    ],
                ],
            ],
            'logout' => [
                'type' => Literal::class,
                'options' => [
                    'route' => '/logout',
                    'defaults' => [
                        'controller' => Controller\AuthController::class,
                        'action' => 'logout',
                    ],
                ],
            ],
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
            'dashboards' => [
                'type' => Literal::class,
                'options' => [
                    'route'    => '/dashboards',
                    'defaults' => [
                        'controller' => Controller\DashboardController::class,
                        'action'     => 'home',
                    ],
                ],
                'child_routes' => [
                    'admin' => [
                        'type' => Literal::class,
                        'options' => [
                            'route' => '/admin',
                            'defaults' => [
                                'controller' => Controller\DashboardController::class,
                                'action' => 'admin',
                            ]
                        ],
                        'may_terminate' => true,
                        'child_routes' => [
                            'projects-table' => [
                                'type' => Literal::class,
                                'options' => [
                                    'route' => '/projects',
                                    'defaults' => [
                                        'controller' => Controller\DashboardController::class,
                                        'action' => 'adminProjects',
                                    ]
                                ],
                            ],
                        ],
                    ],
                    'opportunity' => [
                        'type' => Literal::class,
                        'options' => [
                            'route' => '/opportunity',
                            'defaults' => [
                                'controller' => Controller\DashboardController::class,
                                'action' => 'opportunity',
                            ]
                        ],
                        'may_terminate' => true,
                        'child_routes' => [
                            'opportunities-table' => [
                                'type' => Literal::class,
                                'options' => [
                                    'route' => '/opportunities',
                                    'defaults' => [
                                        'controller' => Controller\DashboardController::class,
                                        'action' => 'opportunityOpportunities',
                                    ]
                                ],
                            ],
                            'shared-opportunities-table' => [
                                'type' => Literal::class,
                                'options' => [
                                    'route' => '/shared',
                                    'defaults' => [
                                        'controller' => Controller\DashboardController::class,
                                        'action' => 'opportunitySharedOpportunities',
                                    ]
                                ],
                            ],
                            'other-users-opportunities-table' => [
                                'type' => Literal::class,
                                'options' => [
                                    'route' => '/other',
                                    'defaults' => [
                                        'controller' => Controller\DashboardController::class,
                                        'action' => 'opportunityOtherOpportunities',
                                    ]
                                ],
                            ],
                        ],
                    ],
                    'project' => [
                        'type' => Literal::class,
                        'options' => [
                            'route' => '/project',
                            'defaults' => [
                                'controller' => Controller\DashboardController::class,
                                'action' => 'project',
                            ]
                        ],
                        'may_terminate' => true,
                    ],
                    'architect' => [
                        'type' => Literal::class,
                        'options' => [
                            'route' => '/architect',
                            'defaults' => [
                                'controller' => Controller\DashboardController::class,
                                'action' => 'architect',
                            ]
                        ],
                        'may_terminate' => true,
                    ],
                    'quote' => [
                        'type' => Literal::class,
                        'options' => [
                            'route' => '/quote',
                            'defaults' => [
                                'controller' => Controller\DashboardController::class,
                                'action' => 'quote',
                            ]
                        ],
                        'may_terminate' => true,
                        'child_routes' => [
                            'own' => [
                                'type' => Literal::class,
                                'options' => [
                                    'route' => '/own',
                                    'defaults' => [
                                        'controller' => Controller\DashboardController::class,
                                        'action' => 'ownQuotes',
                                    ]
                                ],
                            ],
                            'shared' => [
                                'type' => Literal::class,
                                'options' => [
                                    'route' => '/shared',
                                    'defaults' => [
                                        'controller' => Controller\DashboardController::class,
                                        'action' => 'sharedQuotes',
                                    ]
                                ],
                            ],
                        ],
                    ],
                    'quoted-items' => [
                        'type' => Literal::class,
                        'options' => [
                            'route' => '/quoted-items',
                            'defaults' => [
                                'controller' => Controller\DashboardController::class,
                                'action' => 'quoteditems',
                            ]
                        ],
                        'may_terminate' => true,
                        'child_routes' => [
                            'items' => [
                                'type' => Literal::class,
                                'options' => [
                                    'route' => '/items',
                                    'defaults' => [
                                        'controller' => Controller\DashboardController::class,
                                        'action' => 'itemsQuotedItems',
                                    ]
                                ],
                            ],
                        ],
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
            'index' => [
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
            'project-note' => [
                'type' => Segment::class,
                'options' => [
                    'route'    => '/note[/:id[/:action]]',
                    'constraints' => [
                        'action' => '[a-zA-Z][a-zA-Z0-9_-]*',
                        'id'     => '[0-9]+',
                    ],
                    'defaults' => [
                        'controller' => Controller\ProjectNoteController::class,
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
            'opportunities' => [
                'type' => Literal::class,
                'options' => [
                    'route'    => '/opportunities',
                    'constraints' => [
                        'id' => '[0-9]+',
                    ],
                    'defaults' => [
                        'controller' => Controller\OpportunityController::class,
                    ],
                ],
                'may_terminate' => true,
                'child_routes' => [
                    'new' => [
                        'type' => Segment::class,
                        'options' => [
                            'route' => '/[:id][/:action]',
                            'constraints' => [
                                'id' => '[0-9]+',
                                'action' => '[a-zA-Z][a-zA-Z0-9_-]*',
                            ],
                        ],
                    ]
                ]
            ],
            'opportunity-shares' => [
                'type' => Segment::class,
                'options' => [
                    'route'    => '/opportunity-shares[/:id]',
                    'constraints' => [
                        'id' => '[0-9]+',
                    ],
                    'defaults' => [
                        'controller' => Controller\OpportunityShareController::class,
                    ],
                ],
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
            'market-segment' => [
                'type' => Segment::class,
                'options' => [
                    'route'    => '/market-segment[/:id]',
                    'constraints' => [
                        'id' => '[0-9]+',
                    ],
                    'defaults' => [
                        'controller' => Controller\MarketSegmentController::class,
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
                    'find-user' => [
                        'type' => Literal::class,
                        'options' => [
                            'route'    => '/users',
                            'defaults' => [
                                'controller' => Controller\Api\UserController::class,
                                'action'     => 'users',
                            ],
                        ],
                    ],
                ]
            ],
        ],
    ],
    'controllers' => [
        'factories' => [
            Controller\AuthController::class => function (ContainerInterface $container) {
                $authService = $container->get(Service\LdapAuthService::class);
                return new Controller\AuthController($authService);
            },
            Controller\DashboardController::class => function (ContainerInterface $container) {
                return new Controller\DashboardController($container);
            },
            Controller\IndexController::class => function (ContainerInterface $container) {
                return new Controller\IndexController($container);
            },
            Controller\SidebarController::class => function () {
                return new Controller\SidebarController();
            },
            Controller\OpportunityController::class => function (ContainerInterface $container) {
                return new Controller\OpportunityController($container);
            },
            Controller\OpportunityShareController::class => function (ContainerInterface $container) {
                return new Controller\OpportunityShareController($container);
            },
            Controller\ProjectController::class => function (ContainerInterface $container) {
                return new Controller\ProjectController($container);
            },
            Controller\ProjectShareController::class => function (ContainerInterface $container) {
                return new Controller\ProjectShareController(
                    $container->get(Model\ProjectShare::class),
                    $container
                );
            },
            Controller\QuoteController::class => function (ContainerInterface $container) {
                return new Controller\QuoteController($container);
            },
            Controller\UserController::class => function (ContainerInterface $container) {
                return new Controller\UserController(
                    $container->get(Adapter::class),
                    $container->get(Model\User::class)
                );
            },
            Controller\CustomerController::class => function (ContainerInterface $container) {
                return new Controller\CustomerController(
                    $container->get(Model\Customer::class)
                );
            },
            Controller\ArchitectController::class => function (ContainerInterface $container) {
                return new Controller\ArchitectController($container);
            },
            Controller\ItemController::class => function (ContainerInterface $container) {
                return new Controller\ItemController(
                    $container->get(Model\Item::class)
                );
            },
            Controller\ProjectNoteController::class => function (ContainerInterface $container) {
                return new Controller\ProjectNoteController(
                    $container->get(Model\ProjectNote::class)
                );
            },
            Controller\SpecifierController::class => function (ContainerInterface $container) {
                return new Controller\SpecifierController(
                    $container->get(Model\Specifier::class)
                );
            },
            Controller\AddressController::class => function (ContainerInterface $container) {
                return new Controller\AddressController(
                    $container->get(Model\Address::class)
                );
            },
            Controller\RoleOverrideController::class => function (ContainerInterface $container) {
                return new Controller\RoleOverrideController($container);
            },
            Controller\Api\PreferenceController::class => function (ContainerInterface $container) {
                return new Controller\Api\PreferenceController(
                    $container->get(Service\UserService::class),
                    $container->get(Model\UserPreferenceTable::class),
                );
            },
            Controller\Api\UserController::class => function (ContainerInterface $container) {
                return new Controller\Api\UserController($container);
            },
        ],
    ],
    'view_manager' => [
        'display_not_found_reason' => true,
        'display_exceptions'       => true,
        'layout'                   => 'layout/inertia',
        'doctype'                  => 'HTML5',
        'not_found_template'       => 'layout/inertia',
        'exception_template'       => 'layout/inertia',
        'template_map' => [
            'layout/inertia'          => __DIR__ . '/../view/layout/inertia.phtml',
            'layout/layout'           => __DIR__ . '/../view/layout/default.phtml',
            'layout/nonheader'        => __DIR__ . '/../view/layout/nonheader.phtml',
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
            Listener\AuthGuard::class => InvokableFactory::class,
            Service\LdapAuthService::class => function (ContainerInterface $container) {
                $config = $container->get('config');
                return new Service\LdapAuthService($config['ldap']['default']);
            },
            Service\UserService::class => function (ContainerInterface $container) {
                return new Service\UserService(
                    $container->get(Model\User::class)
                );
            },
            Model\User::class => function (ContainerInterface $container) {
                $dbAdapter = $container->get(Adapter::class);
                return new Model\User(
                    $dbAdapter,
                    new TableGateway('P21_Users', $dbAdapter)
                );
            },
            Model\UserPreferenceTable::class => function (ContainerInterface $container) {
                $dbAdapter = $container->get(Adapter::class);
                return new Model\UserPreferenceTable(
                    new TableGateway('user_preferences', $dbAdapter)
                );
            },
            Model\Location::class => function (ContainerInterface $container) {
                $dbAdapter = $container->get(Adapter::class);
                return new Model\Location(
                    new TableGateway('P21_Location_x_Branch', $dbAdapter)
                );
            },
            Model\Architect::class => function (ContainerInterface $container) {
                $dbAdapter = $container->get(Adapter::class);
                return new Model\Architect(
                    $dbAdapter,
                    new TableGateway('architects', $dbAdapter),
                    $container
                );
            },
            Model\Specifier::class => function (ContainerInterface $container) {
                $dbAdapter = $container->get(Adapter::class);
                return new Model\Specifier(
                    $dbAdapter,
                    new TableGateway('specifiers', $dbAdapter),
                    $container,
                );
            },
            Model\Address::class => function (ContainerInterface $container) {
                $dbAdapter = $container->get(Adapter::class);
                return new Model\Address(
                    $dbAdapter,
                    new TableGateway('addresses', $dbAdapter),
                    $container
                );
            },
            Model\Customer::class => function (ContainerInterface $container) {
                $dbAdapter = $container->get(Adapter::class);
                return new Model\Customer(
                    $dbAdapter,
                    new TableGateway('P21_customers_x_address', $dbAdapter),
                    new TableGateway('P21_customers_x_address_x_contacts', $dbAdapter)
                );
            },
            Model\Project::class => function (ContainerInterface $container) {
                $dbAdapter = $container->get(Adapter::class);
                return new Model\Project(
                    $dbAdapter,
                    new TableGateway('projects', $dbAdapter),
                    new TableGateway('p2q_view_projects', $dbAdapter),
                    new TableGateway('p2q_view_projects_lite', $dbAdapter),
                    new TableGateway('p2q_view_projects_share', $dbAdapter),
                    $container
                );
            },
            Model\ProjectShare::class => function (ContainerInterface $container) {
                $dbAdapter = $container->get(Adapter::class);
                return new Model\ProjectShare(
                    $dbAdapter,
                    new TableGateway('project_shares', $dbAdapter),
                    $container
                );
            },
            Model\Quote::class => function (ContainerInterface $container) {
                $dbAdapter = $container->get(Adapter::class);
                return new Model\Quote(
                    $dbAdapter,
                    new TableGateway('quotes', $dbAdapter),
                    new TableGateway('p2q_view_quote_x_project_x_oe', $dbAdapter),
                    $container
                );
            },
            Model\Item::class => function (ContainerInterface $container) {
                $dbAdapter = $container->get(Adapter::class);
                return new Model\Item(
                    $dbAdapter,
                    $container->get(Service\UserService::class),
                    new TableGateway('project_items', $dbAdapter),
                    new TableGateway('quote_items', $dbAdapter),
                );
            },
            Model\ProjectNote::class => function (ContainerInterface $container) {
                $dbAdapter = $container->get(Adapter::class);
                return new Model\ProjectNote(
                    $dbAdapter,
                    $container->get(Service\UserService::class),
                    $container,
                );
            },
            Service\MailerService::class => function (ContainerInterface $container) {
                $config = $container->get('config');
                $twig = $container->get(\Twig\Environment::class);

                return new Service\MailerService(
                    $config['mailer']['dsn'],
                    $config['mailer']['from'],
                    $twig,
                );
            },
            \Twig\Environment::class => function () {
                $loader = new \Twig\Loader\FilesystemLoader([
                    realpath(__DIR__ . '/../view/email')
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
