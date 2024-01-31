<?php

use Centura\Model\Customer;
use Centura\Model\User;
use Centura\Model\Project;
use Centura\Model\Quote;
use Centura\Model\ProductProject;

class ApproveController extends Zend_Controller_Action
{

    public function init()
    {
        /* Initialize action controller here */
    }

    public function indexAction()
    {
    	$quote_id = $this->getRequest()->getParam('id');
    	 
    	if($quote_id == null)
    	{
    		$this->redirect('/');
    	}
    	 
    	
    	$customer = new Customer();
    	$sales = new User();
    	$project = new Project();
    	$quote = new Quote();
    	$products = new ProductProject();
    	
    	$quote_detail = $quote->fetchquotebyid($quote_id);
    	$project_detail = $project->fetchbyid($quote_detail['project_id']);


    	$this->view->customer = $customer->fetchCustomerById($quote_detail['customer_id']);
    	$this->view->quote = $quote_detail;
    	$this->view->arch = $sales->fetchallsales();
    	$this->view->approval = $sales->getQuoteapproval();
    	$this->view->project = $project_detail;
    	$this->view->type = $quote->fetchquotetype();
    	$this->view->items = $products->fetchallitemslive($quote_id);
    	
    	$this->view->terms = $quote->fetchallterms();

    	
    	$this->view->userterm = $quote->fetchuserterm($quote_detail['customer_id']);
    	$this->view->leadtime = $quote->fetchleadtimes();
    	

    }
 

}

