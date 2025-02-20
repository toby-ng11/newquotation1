<?php

declare(strict_types = 1);

chdir(dirname(__DIR__));

use Zend\Loader\StandardAutoloader;
use Zend\Mvc\Application;

require 'vendor/autoload.php';

error_reporting(E_ALL);
//ini_set('display_startup_errors', '1');
//ini_set('display_errors', '1');

/*
if (! class_exists(Application::class)) {
    throw new RuntimeException(
        "Unable to load application.\n"
        . "- Type `composer install` if you are developing locally.\n"
        . "- Type `docker-compose run laminas composer install` if you are using Docker.\n"
    );
}*/


// Define path to application directory
defined('APPLICATION_PATH')
    || define('APPLICATION_PATH', realpath(__DIR__ . '/../application'));

// Define application environment
defined('APPLICATION_ENV')
    || define('APPLICATION_ENV', (getenv('APPLICATION_ENV') ? getenv('APPLICATION_ENV') : 'production'));

// Ensure library/ is on include_path
set_include_path(implode(PATH_SEPARATOR, array(
    realpath(APPLICATION_PATH . '/../library'),
    get_include_path(),
)));

define('ZF2_PATH', realpath(__DIR__ . '/../vendor/zendframework'));
require_once ZF2_PATH . '/zend-loader/src/StandardAutoloader.php';
$loader = new StandardAutoloader(array(
    'autoregister_zf' => true
));
$loader->register();

Application::init(require 'config/application.config.php')->run();

/** Zend_Application */
require_once 'Zend/Application.php';

// Create application, bootstrap, and run
$application = new Zend_Application(
    APPLICATION_ENV,
    APPLICATION_PATH . '/configs/application.ini'
);

$application->bootstrap()
            ->run();

