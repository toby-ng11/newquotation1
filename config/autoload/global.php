<?php

/**
 * Global Configuration Override
 *
 * You can use this file for overriding configuration values from modules, etc.
 * You would place values in here that are agnostic to the environment and not
 * sensitive to security.
 *
 * NOTE: In practice, this file will typically be INCLUDED in your source
 * control, so do not include passwords or other sensitive information in this
 * file.
 */

use Laminas\Db\Adapter\Adapter;
use Laminas\Db\TableGateway\TableGateway;
use Laminas\Session\Config\SessionConfig;
use Laminas\Session\SaveHandler\DbTableGateway;
use Laminas\Session\SaveHandler\DbTableGatewayOptions;
use Psr\Container\ContainerInterface;

return [
    'session_config' => [
        'cookie_lifetime' => 86400, // 1 days in seconds
        'gc_maxlifetime' => 10800, // Garbage collection max lifetime
        'name' => 'app_session',
        'config_class' => SessionConfig::class,
    ],
    'service_manager' => [
        'factories' => [
            Laminas\Db\Adapter\Adapter::class => Laminas\Db\Adapter\AdapterServiceFactory::class,
            Laminas\Session\Config\ConfigInterface::class => Laminas\Session\Service\SessionConfigFactory::class,
            'SessionSaveHandler' => function (ContainerInterface $container) {
                $adapter = $container->get(Adapter::class);
                $tableGateway = new TableGateway('laminas_sessions', $adapter);
                $dbOptions = new DbTableGatewayOptions([
                    'idColumn' => 'id',
                    'nameColumn'     => 'name',
                    'modifiedColumn' => 'modified',
                    'lifetimeColumn' => 'lifetime',
                    'dataColumn'     => 'data',
                ]);
                return new DbTableGateway($tableGateway, $dbOptions);
            },
        ],
        'validators' => [
            \Laminas\Session\Validator\RemoteAddr::class,
            \Laminas\Session\Validator\HttpUserAgent::class,
        ],
    ],
    'session_storage' => [
        'type' => \Laminas\Session\Storage\SessionArrayStorage::class,
    ],
    'session_containers' => [
        'UserSession'
    ]
];
