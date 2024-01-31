<?php

use Centura\Model\User;
use Centura\Model\Quote;
use Centura\Model\Project;

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
    
    public function fetchspecbylocationAction()
    {
    	$location = $this->getRequest()->getParam('loc','TOR');
    	$quote = new Quote();
    
    	$result = $quote->fetchsepc($location);
    	echo json_encode(($result));
    	exit;
    }
    
    public function fetchspecAction()
    {
    	$patten = $this->getRequest()->getParam('term');
    	$location = $this->getRequest()->getParam('loc','TOR');
    	
    	$project = new Project();
    	
    	$result = $project->fetchspecbypattern($patten,$location);
    	echo json_encode(($result));
    	exit;
    }

}

