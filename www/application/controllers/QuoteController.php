<?php

use Centura\Model\{
	Customer,
	User,
	Quote,
	Location,
	Project,
	ProductProject,
	Item,
	ItemsProject
};

//use Zend_Controller_Action;
//use Zend_Registry;
//use Zend_Json;

//use Exception;

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

		if ($project_id == null) {
			$this->redirect('/');
		}

		$model = new Item();

		$sales = new User();
		$project = new Project();
		$quote = new Quote();

		$project_detail = $project->fetchbyid($project_id);

		if ($project_detail['status'] == 13) //Project closed 
		{
			$this->redirect('/project/view/id/' . $project_id);
		}

		$this->view->headTitle()->set('Make Quote: ' . $project_id . ' - ' . $project_detail['project_name']);

		$item = new ItemsProject();
		$this->view->items = $item->fetchallitems($project_id);

		$this->view->arch = $sales->fetchallsales();
		//$this->view->approval = $sales->getQuoteapproval();
		$this->view->project = $project_detail;
		$this->view->type = $quote->fetchquotetype();
		$this->view->seg = $project->fetchProjectSegment();
	}

	public function editAction()
	{
		$quote_id = $this->getRequest()->getParam('id');

		if ($quote_id == null) {
			$this->redirect('/');
		}

		$customer = new Customer();
		$contact = new Customer();
		$contactList = new Customer();
		$sales = new User();
		$project = new Project();
		$quote = new Quote();
		$products = new ProductProject();

		$quote_detail = $quote->fetchquotebyid($quote_id);
		//echo Zend_Json::encode($quote_detail);
		$project_detail = $project->fetchbyid($quote_detail['project_id']);
		$customerDetail = $customer->fetchCustomerByContact($quote_detail['contact_id']);

		$this->view->headTitle()->set('Quote Edit: ' . $quote_id . ' - ' . $project_detail['project_name']);

		$this->view->contact = $contact->fetchContactByID($quote_detail['contact_id']);
		$this->view->customer = $customerDetail;
		$this->view->contactList = $contactList->fetchContactsByCustomer($customerDetail['customer_id']);
		$this->view->quote = $quote_detail;
		$this->view->architect_rep = $sales->fetchsalebyid($quote_detail['architect_rep_id']);
		//$this->view->approval = $sales->getQuoteapproval();
		$this->view->project = $project_detail;
		$this->view->type = $quote->fetchquotetype();
		$this->view->items = $products->fetchallitems($quote_id);
		$this->view->seg = $project->fetchProjectSegment();
		$this->view->oe_id = $quote->fetchP21OrderNumber($quote_id);

		if ($this->_request->isPost()) {
			$data = $this->_request->getPost();

			$model = new Quote();

			$result = $model->edit($data, $quote_id);
			if($result == true) {
				$this->redirect('/quote/edit/id/' . $result);
			}
			else {
				echo 'false';
			}
		}
	}

	public function itemAction()
	{
		//$project_id = $this->getRequest()->getParam('project');
		//$item = new ItemsProject();
		//echo $item->fetchallitemsJson($project_id);

		$quote_id = $this->getRequest()->getParam('id');
		$products = new ProductProject();
		echo $products->fetchallitems($quote_id, true);
		exit;
	}

	public function additemAction()
    { 
    	$quote_id = $this->getRequest()->getParam('id');
    
    	if ($this->_request->isXmlHttpRequest() && $this->_request->isPost() && $quote_id != null)
    	{
    		$data = $this->_request->getPost();
    
    		$item = new ProductProject();
    		echo $item->add($data, $quote_id);
    	}
    	else {
    		echo '0';
		}
    	exit;
    }

	public function edititemAction()
    {
    	$item_uid = $this->getRequest()->getParam('uid');
    
    	if ($this->_request->isXmlHttpRequest() && $this->_request->isPost() && $item_uid != null) {
    		$data = $this->_request->getPost();
    		$item = new ProductProject();
    		echo $item->edititem($data, $item_uid);
    	} 
		else {
    		echo '0';
    	}
    	exit;
    }

	public function deleteitemAction()
    {
    	$item_uid = $this->getRequest()->getParam('uid');

    	if ($item_uid != null) {
    		$item = new ProductProject();
    		echo $item->remove($item_uid);
    	}
    	else {
    		echo '0';
    	}
    
    	exit;
    }

	public function saveAction()
	{
		if ($this->_request->isPost()) {
			$data = $this->_request->getPost();

			$model = new Quote();
			
			$result = $model->save($data);
			$this->redirect('/quote/edit/id/' . $result);
		}
	}

	public function deleteAction()
	{
		$quote_id = $this->getRequest()->getParam('id');
		$quote = new Quote();

		$quote->remove($quote_id);
		$this->redirect('/index/index');
		exit;
	}

	public function readyAction()
	{
		$quote_id = $this->getRequest()->getParam('id');
		if ($quote_id == null) {
			return false;
		}
		$quote = new Quote();
		$data['status'] = 2; // waiting approve
		$quote->update($data, 'quote_id = ' . $quote_id);
		exit;
	}

	public function approveAction()
	{
		$quote_id = $this->getRequest()->getParam('id');
		if ($quote_id == null) {
			return false;
		}
		$data = $this->_request->getPost();
		$quote = new Quote();

		$quote->edit($data, $quote_id);
		$info['status'] = 3; // approved
		$info['approve_date'] = date('Y-m-d H:i:s'); //approve date
		$info['lead_time_id'] = $data['lead_time_id'];
		$info['price_approve_id'] = $data['price_approve_id'];

		try {
			$quote->update($info, 'quote_id = ' . $quote_id);
		} catch (Exception $e) {
			error_log($e->getMessage());
			exit;
		}

		exit;
	}

	public function disapproveAction()
	{
		$quote_id = $this->getRequest()->getParam('id');
		if ($quote_id == null) {
			return false;
		}
		$quote = new Quote();
		$data['status'] = 4; // disapproved
		//$data['quote_approval'] = ''; // disapproved
		$quote->update($data, 'quote_id = ' . $quote_id);

		exit;
	}

	public function unsubmitAction()
	{
		$quote_id = $this->getRequest()->getParam('id');
		if ($quote_id == null) {
			return false;
		}
		$quote = new Quote();
		$data['status'] = 5; // unsubmit
		$quote->update($data, 'quote_id = ' . $quote_id);
		$this->redirect('/quote/edit/id/' . $quote_id);
		exit;
	}

	private function getcompany_name()
	{
		if (DEFAULT_COMPNAY == null) {
			return 'TORONTO';
		}

		$company = array(
			'TOR' => 'TORONTO',
			'OTT' => 'OTTAWA',
			'HAM' => 'HAMILTON',
			'VAN' => 'VANCOUVER',
			'WES' => 'CALGARY',
			'QUE' => 'MONTREAL'
		);

		return $company[DEFAULT_COMPNAY];
	}

	public function printAction()
	{
		$quote_id = $this->getRequest()->getParam('id');

		if ($quote_id == null) {
			$this->redirect('/');
		}

		$customer = new Customer();
		$contact = new Customer();
		$sales = new User();
		$project = new Project();
		$quote = new Quote();
		$products = new ProductProject();
		$item = new ItemsProject();

		$quote_detail = $quote->fetchquotebyid($quote_id);
		$project_detail = $project->fetchbyid($quote_detail['project_id']);
		$customerDetail = $customer->fetchCustomerByContact($quote_detail['contact_id']);

		$this->view->headTitle()->set('Quote For ' . $project_detail['project_name'] . ' - Centura', 'SET');

		$this->view->contact = $contact->fetchContactByID($quote_detail['contact_id']);
		$this->view->customer = $customerDetail;
		$this->view->quote = $quote_detail;
		$this->view->arch = $sales->fetchallsales();
		$this->view->approval = $sales->getQuoteapproval();
		$this->view->project = $project_detail;
		$this->view->type = $quote->fetchquotetype();
		$this->view->items = $products->fetchallitems($quote_id);
		//$this->view->items = $item->fetchallitems($quote_detail['project_id']);
		$this->view->spec_name = $project->fetchspecbyid($project_detail['specifiler']);

		$locations = new Location();
		$this->view->locations = $locations->fetchAllBranches();

		$this->view->leadtime = $quote->fetchleadtimes();

		$this->_helper->layout->setLayout('print');
		$this->render('print' . '-' . DEFAULT_COMPNAY);
	}
}
