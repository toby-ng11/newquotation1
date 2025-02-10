<?php

class LogoutController extends Zend_Controller_Action
{

    public function init()
    {
        /* Initialize action controller here */
        $this->session =  Zend_Registry::get('session');
    }

    public function indexAction()
    {
   		header("HTTP/1.1 401 Unauthorized");
        header("Location: /");
        exit;
    }


}

