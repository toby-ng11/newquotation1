<?php

use Centura\Model\{
	Customer,
	User,
	Project,
	Quote,
	ProductProject
};

class ApproveController extends Zend_Controller_Action
{

    public function init()
    {
        /* Initialize action controller here */
		$this->session =  Zend_Registry::get('session');
    }

    public function indexAction()
    {
		if ($this->session->user['approve_id'] == null) {
			$this->redirect('/index');
		}

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

		$this->view->headTitle()->set('Approval: ' . $quote_id . ' - ' . $project_detail['project_name']);

    	$this->view->customer = $customer->fetchCustomerById($quote_detail['customer_id']);
    	$this->view->quote = $quote_detail;
    	$this->view->arch = $sales->fetchallsales();
    	$this->view->approval = $sales->getQuoteapproval();
    	$this->view->project = $project_detail;
    	$this->view->type = $quote->fetchquotetype();
    	//$this->view->items = $products->fetchallitemslive($quote_id); // legacy
    	
    	$this->view->terms = $quote->fetchallterms();

    	
    	$this->view->userterm = $quote->fetchuserterm($quote_detail['customer_id']);
    	$this->view->leadtime = $quote->fetchleadtimes();
    	
		$this->view->seg = $quote->fetchseg();

		$this->view->oe_id = $quote->fetchP21OrderNumber($quote_id);

		if ($this->_request->isPost()) {
			$data = $this->_request->getPost();

			$model = new Quote();

			$result = $model->edit($data, $quote_id);
			if($result == true) {
				$this->redirect('/approve/index/id/' . $result);
			}
			else {
				echo 'false';
			}
		}
    }
}

