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

return [
    'session_config' => [
        'cookie_lifetime' => 86400, // 1 days in seconds
        'gc_maxlifetime' => 864000, // Garbage collection max lifetime
    ],
    'service_manager' => [
        'factories' => [
            Laminas\Db\Adapter\Adapter::class => Laminas\Db\Adapter\AdapterServiceFactory::class,
            Laminas\Session\Config\ConfigInterface::class => Laminas\Session\Service\SessionConfigFactory::class
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
