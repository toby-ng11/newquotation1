<?php

use Centura\Model\Customer;

class CustomerController extends Zend_Controller_Action
{

    public function init()
    {
    
    }

    public function indexAction()
    {
    	$id = $this->getRequest()->getParam('id');
        $customer = new Customer();
        
        var_dump($customer->fetchCustomerById($id));
        
        exit;
        
    }
    public function fetchbyidAction() // ajax get customer by id
    {
        $id = $this->getRequest()->getParam('id');
        $customer = new Customer();
        
        $result = $customer->fetchCustomerById($id);
        echo json_encode(($result));
        exit;
    }
    
 	public function fetchbyemailAction() // ajax get customer by email
    {
        $email = $this->getRequest()->getParam('email');
        
        $customer = new Customer();
        
        $result = $customer->fetchCustomerByEmail($email);
        echo json_encode($result);
        exit;
        
    }
    
    public function emailAction()
    {
    	$email = $this->getRequest()->getParam('term');
    	$customer = new Customer();
    	
    	$result = $customer->fetchCustomerEmailByIdPatten($email);
    	echo json_encode($result);
    	exit;
    }
    
    public function idAction()
    {
    	$id = $this->getRequest()->getParam('term');
    	$customer = new Customer();
    	 
    	$result = $customer->fetchCustomeridByIdPatten($id);
    	echo json_encode($result);
    	exit;
    }
    
    public function nameAction()
    {
    	$name = $this->getRequest()->getParam('term');
    	$customer = new Customer();
    	
    	$result = $customer->fetchCustomerInfoBynamePatten($name);
    	echo json_encode($result);
    	exit;
    }
    
    public function quoteAction()
    {
    	$name = $this->getRequest()->getParam('term');
    	$customer = new Customer();
    	 
    	$result = $customer->fetchCustomerInfoByquotePatten($name);
    	echo json_encode($result);
    	exit;
    }
    
    public function fetchbynamecompanyAction()
    {
    	$name = $this->getRequest()->getParam('term');
    	$company = $this->getRequest()->getParam('company');
    	$customer = new Customer();
    	 
    	$result = $customer->fetchCustomerInfoByquotePatten($name,20,$company);
    	echo json_encode($result);
    	exit;
    	
    }


}

