<?php

use Centura\Model\User;
use Centura\View\Plugin\Layout;

class Bootstrap extends Zend_Application_Bootstrap_Bootstrap
{
	protected function _initDefaultModule(){
	     $this->bootstrap("frontController");
	  }
    
    
    protected function _initZFDebug()
    {
		return;
        if(APPLICATION_ENV == 'production' && $_GET['debug'] != 'centura') return;
    	$autoloader = Zend_Loader_Autoloader::getInstance();
    	$autoloader->registerNamespace('ZFDebug');
    
    	$options = array(
    			'plugins' => array('Variables',
    					'File' => array('base_path' => realpath(APPLICATION_PATH ."/../")),
    					'Memory',
    					'Time',
    					'Registry',
    					'Database' => array('adapter' => array('default' => Zend_Db_Table::getDefaultAdapter())),
    					'Exception')
    	);
    	# Instantiate the database adapter and setup the plugin.
    	# Alternatively just add the plugin like above and rely on the autodiscovery feature.
    	if ($this->hasPluginResource('db')) {
    		$this->bootstrap('db');
    		$db = $this->getPluginResource('db')->getDbAdapter();
    		$options['plugins']['Database']['adapter'] = $db;
    	}
    	
    	# Setup the cache plugin
    	if ($this->hasPluginResource('cache')) {
    	$this->bootstrap('cache');
    	$cache = $this->getPluginResource('cache')->getDbAdapter();
    	$options['plugins']['Cache']['backend'] = $cache->getBackend();
    	}

    	$debug = new ZFDebug_Controller_Plugin_Debug($options);
    
    	$this->bootstrap('frontController');
    	$frontController = $this->getResource('frontController');
    	$frontController->registerPlugin($debug);
    	}
    	
    	protected function _initSession()
    	{
    		//$this->bootstrap('session');
			//Zend_Session::start();
    		$session = new Zend_Session_Namespace('centura');
    		Zend_Registry::set('session', $session);
    	}
    	
    	protected function _initDatabase(){
    		// get config from config/application.ini
    		$config = $this->getOptions();
    		 
    		$db = Zend_Db::factory($config['resources']['db']['adapter'], $config['resources']['db']['params']);
    		 
    		//set default adapter
    		Zend_Db_Table::setDefaultAdapter($db);
    		 
    		//save Db in registry for later use
    		Zend_Registry::set("db", $db);
    	}
    	 
    	protected function _initloader()
    	{
    		$autoloader = Zend_Loader_Autoloader::getInstance();
			$autoloader->registerNamespace('Centura_');
    		$autoloader->registerNamespace('Centura\\'); // for migrate from ZF1 to ZF2
    	}
    	 
    	protected function _initLayout()
    	{
    		Zend_Layout::startMvc(array(
    		'layoutPath' => APPLICATION_PATH ."/layouts/scripts",
    		'layout' => 'default'
    		));
    		 
    		$layoutModulePlugin = new Layout();
    		//here you can register as many layouts as you need, if no layout is found it will use default one
    		$layoutModulePlugin->registerModuleLayout('admin', APPLICATION_PATH."/layouts/scripts", 'admin');
    		Zend_Controller_Front::getInstance()->registerPlugin($layoutModulePlugin);
    	}
    	 
    	protected function _initTitle()
    	{
    		$view = $this->bootstrap('view')->getResource('view');
    		$view->doctype('XHTML11'); //end the html element with '/>'
    		$view->headTitle('Centura Project to Quote System');
    		$view->headMeta('Centura');
    		$view->headMeta('Centura');
    	}
    	 
    	protected function _initLocale()
    	{
    		date_default_timezone_set('America/New_York');
    		$locale = Zend_Registry::set('Zend_Locale','en_US');
    			
        }
        
        protected function _initZone() // init zone and user
        {
            
            define('PRICE_LOW','1.25');
            
            $model = new User();
            
           $session = Zend_Registry::get('session');
           $name = str_replace('CENTURA\\', '', $_SERVER['REMOTE_USER']);
           $name = str_replace('centura\\', '', $name);
           
           /*override company*/
           $user = $model->fetchsalebyid($name);
          
           
           if(isset($_GET['company']) && $_GET['company'] != null) //allow override
           {
           		$default_company = $_GET['company'];
           		$company = $model->fetchlocationid($default_company);
           		$company_id = $company['location_id'];
           }
           else {
           		$default_company = $user["default_company"];
           		$company_id = $user['default_location_id'];

           }
           
         
           
           if($company_id == 102)
           {
           	 $company_id = 101;
           }
           
           define("DEFAULT_COMPNAY", $default_company); // default company
           define("DEFAULT_COMPNAY_ID", $company_id); // default company id
           
        
           $session->user = $model->fetchuser($name);
           
           $config = new Zend_Config_Ini(APPLICATION_PATH . '/configs/application.ini', APPLICATION_ENV);
           define('SITEURL',$_SERVER['HTTP_HOST']);
           
        }
}

