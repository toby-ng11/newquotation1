<?php

class PermissionController extends Zend_Controller_Action
{

    public function init()
    {
        /* Initialize action controller here */
        $this->session =  Zend_Registry::get('session');
    }

    public function indexAction()
    {
	      $this->view->error = 'You don\'t have the permission to visit this page';
        
    }


}

