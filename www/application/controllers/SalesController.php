<?php

use Centura\Model\{ 
    User,
    Quote,
    Project
};

class SalesController extends Zend_Controller_Action
{

    public function init()
    {
    
    }

    public function indexAction()
    {
    	
        
    }
    public function fetchbylocationAction() 
    {
        $location = $this->getRequest()->getParam('loc','TOR');
        $customer = new User();
        
        $result = $customer->fetchallsalesbyloc($location);
        echo json_encode(($result));
        exit;
    }


}

