<?php
/**
 * Global Configuration Override
 *
 * You can use this file for overriding configuration values from modules, etc.
 * You would place values in here that are agnostic to the environment and not
 * sensitive to security.
 *
 * @NOTE: In practice, this file will typically be INCLUDED in your source
 * control, so do not include passwords or other sensitive information in this
 * file.
 */

return [
    'phpSettings' => [
        'display_startup_errors' => 0,
        'display_errors' => 0,
        'date.timezone' => 'America/New_York'
    ],
    'db' => [
        'driver' => 'Pdo_Sqlsrv',
        'dsn' => 'sqlsrv:Server=tor-cloud-sql;Database=QUOTATION',
        'username' => '',
        'password' => '',
        'driver_options' => [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::SQLSRV_ATTR_ENCODING => PDO::SQLSRV_ENCODING_UTF8,
            PDO::SQLSRV_ATTR_FETCHES_DATETIME_TYPE => true,
        ],
    ],
    'site_url' => 'devquotation.centura.local',
];
