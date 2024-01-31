<?php

use Centura\Model\Customer;

class QuoteController extends Zend_Controller_Action
{

    public function init()
    {
        /* Initialize action controller here */
    	$this->session =  Zend_Registry::get('session');
    }

    public function indexAction()
    {
    	$project_id = $this->getRequest()->getParam('project');
    	
    	if($project_id == null)
    	{
    		$this->redirect('/');
    	}
    	
        $model = new Centura_Model_Item();  
        
        $sales = new Centura_Model_User();
        $project = new Centura_Model_Project();
        $quote = new Centura_Model_Quote();
         
        $project_detail = $project->fetchbyid($project_id);
        
        if($project_detail['status'] == 13)//Project closed 
        {
        	$this->redirect('/project/view/id/'.$project_id);
        }
        
        $item = new Centura_Model_ItemsProject();
        $this->view->items = $item->fetchallitems($project_id);
        
        $this->view->arch = $sales->fetchallsales();
        $this->view->approval = $sales->getQuoteapproval();
        $this->view->project = $project_detail;
        $this->view->type = $quote->fetchquotetype();
        $this->view->seg = $quote->fetchseg();
    }
    
    public function saveAction()
    {
       	if ($this->_request->isPost())
    	{
    		$data = $this->_request->getPost();
    		
    		$model = new Centura_Model_Quote();
    		
    		
    		$result = $model->save($data);
    		$this->redirect('/quote/edit/id/'.$result);
    	}
    }
    
    public function deleteAction()
    {
    	$quote_id = $this->getRequest()->getParam('id');
    	$quote = new Centura_Model_Quote();
    	 
    	$quote->remove($quote_id);
    	$this->redirect('/');
    }
    
    public function readyAction()
    {
    	$quote_id = $this->getRequest()->getParam('id');
    	if($quote_id == null)
    	{
    		return false;
    	}
    	$quote = new Centura_Model_Quote();
    	$data['approve_status'] = 1;// waiting approve
    	$quote->update($data, 'quote_id = '.$quote_id);
    	
    	exit;
    }
    
    public function approveAction()
    {
    	$quote_id = $this->getRequest()->getParam('id');
    	if($quote_id == null)
    	{
    		return false;
    	}
    	$quote = new Centura_Model_Quote();
    	if ($this->_request->isPost())
    	{
    		$data = $this->_request->getPost();
    	
    		try {
    			$result = $quote->edit($data,$quote_id);
    		} catch (Exception $e) {
    			var_dump($e);exit;
    		}
    		
   		}
   		if(($data['quote_approval'] != null || $data['quote_approval'] < 0) && $this->session->user['approve_id'] != null)
   		{
   			$approver_id  = $data['quote_approval'];
   			$data = null;
   			$data['quote_approval'] = $approver_id;
   			$data['approve_status'] = 10;// approved
   		}
    	else
    	{
    		$data = null;
    		if($this->session->user['approve_id'] != null)
    		{
    			$data['quote_approval'] = $this->session->user['approve_id'];// approved user
    			$data['approve_status'] = 10;// approved
    		}
    	}
    	$quote->update($data, 'quote_id = '.$quote_id);
    	 
    	exit;
    }
    
    public function disapproveAction()
    {
    	$quote_id = $this->getRequest()->getParam('id');
    	if($quote_id == null)
    	{
    		return false;
    	}
    	$quote = new Centura_Model_Quote();
    	$data['approve_status'] = -1;// disapproved
    	$data['quote_approval'] = '';// disapproved
    	$quote->update($data, 'quote_id = '.$quote_id);
    
    	exit;
    }

    public function editAction()
    {
    	$quote_id = $this->getRequest()->getParam('id');
    	 
    	if($quote_id == null)
    	{
    		$this->redirect('/');
    	}
    	 
    	
    	$customer = new Customer();
    	$sales = new Centura_Model_User();
    	$project = new Centura_Model_Project();
    	$quote = new Centura_Model_Quote();
    	$products = new Centura_Model_ProductProject();
    	
    	$quote_detail = $quote->fetchquotebyid($quote_id);
    	$project_detail = $project->fetchbyid($quote_detail['project_id']);


    	$this->view->customer = $customer->fetchCustomerById($quote_detail['customer_id']);
    	$this->view->quote = $quote_detail;
    	$this->view->arch = $sales->fetchallsales();
    	$this->view->approval = $sales->getQuoteapproval();
    	$this->view->project = $project_detail;
    	$this->view->type = $quote->fetchquotetype();
    	$this->view->items = $products->fetchallitems($quote_id);
    	
    	if ($this->_request->isPost())
    	{
    		$data = $this->_request->getPost();
    	
    		$model = new Centura_Model_Quote();
    	
    		$result = $model->edit($data,$quote_id);
    		$this->redirect('/quote/edit/id/'.$result);
    	}

    }
    
    public function printAction()
    {
    	$quote_id = $this->getRequest()->getParam('id');
    	
    	if($quote_id == null)
    	{
    		$this->redirect('/');
    	}
    	
    	$customer = new Customer();
    	$sales = new Centura_Model_User();
    	$project = new Centura_Model_Project();
    	$quote = new Centura_Model_Quote();
    	$products = new Centura_Model_ProductProject();
    	 
    	$quote_detail = $quote->fetchquotebyid($quote_id);
    	$project_detail = $project->fetchbyid($quote_detail['project_id']);
    	
    	$this->view->customer = $customer->fetchCustomerById($quote_detail['customer_id']);
    	$this->view->quote = $quote_detail;
    	$this->view->arch = $sales->fetchallsales();
    	$this->view->approval = $sales->getQuoteapproval();
    	$this->view->project = $project_detail;
    	$this->view->type = $quote->fetchquotetype();
    	$this->view->items = $products->fetchallitems($quote_id);
    	$this->view->spec_name = $project->fetchspecbyid($project_detail['specifiler']);
    	
    	$locations = new Centura_Model_Location();
    	$this->view->locations = $locations->fetchAllBranches();
    	
    	$this->view->leadtime = $quote->fetchleadtimes();
    	
    	$this->_helper->layout->setLayout('print');
    }

}

