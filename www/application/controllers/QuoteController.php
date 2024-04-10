<?php

use Centura\Model\Customer;
use Centura\Model\User;
use Centura\Model\Quote;
use Centura\Model\Location;
use Centura\Model\Project;
use Centura\Model\ProductProject;
use Centura\Model\Item;
use Centura\Model\ItemsProject;

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

		$item = new ItemsProject();
		$this->view->items = $item->fetchallitems($project_id);

		$this->view->arch = $sales->fetchallsales();
		$this->view->approval = $sales->getQuoteapproval();
		$this->view->project = $project_detail;
		$this->view->type = $quote->fetchquotetype();
		$this->view->seg = $quote->fetchseg();
	}

	public function itemAction()
	{
		//$project_id = $this->getRequest()->getParam('project');
		//$item = new ItemsProject();
		//echo $item->fetchallitemsJson($project_id);

		$quote_id = $this->getRequest()->getParam('id');
		$products = new ProductProject();
		echo $products->fetchallitemsJson($quote_id);
		exit;
	}

	public function additemAction()
	{
		$quote_id = $this->getRequest()->getParam('id');

		if ($this->_request->isXmlHttpRequest() && $this->_request->isPost() && $quote_id != null) {
			$data = $this->_request->getPost();

			$products = new ProductProject();
			echo $products->addsingle($data, $quote_id);
		} else {
			echo '0';
		}
		exit;
	}

	public function importitemAction()
	{
		$quote_id = $this->getRequest()->getParam('id');

		if ($this->_request->isXmlHttpRequest() && $this->_request->isPost() && $quote_id != null) {
			$data = $this->_request->getPost();

			$products = new ProductProject();
			echo $products->addsingle($data, $quote_id);
		} else {
			echo '0';
		}
		exit;
	}

	public function edititemAction()
    {
    	$quote_id = $this->getRequest()->getParam('id');
    
    	if ($this->_request->isXmlHttpRequest() && $this->_request->isPost() && $quote_id != null) {
    		$data = $this->_request->getPost();
    		$products = new ProductProject();
    		echo $products->edititem($data, $quote_id);
    	} 
		else {
    		echo '0';
    	}
    	exit;
    }

	public function deleteitemAction()
    {
    	$quote_id = $this->getRequest()->getParam('id');
    	$item_id = $this->getRequest()->getParam('item');
    	$price = $this->getRequest()->getParam('price');
    	$qty = $this->getRequest()->getParam('qty');
    	$uom  = $this->getRequest()->getParam('uom');
		$sort_id  = $this->getRequest()->getParam('sort');
    	
    	if ($quote_id != null && $item_id != null) {
    		$products = new ProductProject();
    		echo $products->remove($quote_id, $item_id, $uom, $price, $qty, $sort_id);
    	}
    	else {
    		echo '0';
    	}
    	exit;
    }

	public function getdataAction()
	{
		$dbDetails = array(
			'host' => '192.168.160.11',
			'user' => 'admin',
			'pass' => '696946',
			'db' => 'Quotation'
		);

		//DB table to use
		$db = $this->getAdapter();
		$table = $db->select()->from('quote')->order('quote_id desc')->join('project', 'project.project_id = quote.project_id', 'project_name')
			->join('quote_status', 'quote_status.uid=project.status', array('status_name' => 'Status'))->where('project.deleted =?', 'N');

		// Table's primary key
		$primaryKey = 'quote_id';

		$columns = array(
			array('db' => 'quote_id', 'dt' => 0),
			array('db' => 'project_name', 'dt' => 1),
			array('db' => 'quote_segment', 'dt' => 2),
			array('db' => 'quote_date', 'dt' => 3),
			array('db' => 'expire_date', 'dt' => 4),
			array('db' => 'ship_required_date', 'dt' => 5),
			array('db' => 'status_name', 'dt' => 6),
			array('db' => 'approve_status', 'dt' => 7),
		);


		echo Zend_Json::encode(
			SSP::simple($_GET, $dbDetails, $table, $primaryKey, $columns)
		);
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
		//$this->redirect('/index/approval');
		exit;
	}

	public function readyAction()
	{
		$quote_id = $this->getRequest()->getParam('id');
		if ($quote_id == null) {
			return false;
		}
		$quote = new Quote();
		$data['approve_status'] = 1; // waiting approve
		$quote->update($data, 'quote_id = ' . $quote_id);

		exit;
	}

	public function approveAction()
	{
		$quote_id = $this->getRequest()->getParam('id');
		if ($quote_id == null) {
			return false;
		}
		$quote = new Quote();
		if ($this->_request->isPost()) {
			$data = $this->_request->getPost();

			try {
				$result = $quote->edit($data, $quote_id);
			} catch (Exception $e) {
				var_dump($e);
				exit;
			}
		}
		if (($data['quote_approval'] != null || $data['quote_approval'] < 0) && $this->session->user['approve_id'] != null) {
			$approver_id  = $data['quote_approval'];
			$data = null;
			$data['quote_approval'] = $approver_id;
			$data['approve_status'] = 10; // approved
			$data['approve_date'] = date('Y-m-d h:i:s'); //approve date
		} else {
			$data = null;
			if ($this->session->user['approve_id'] != null) {
				$data['quote_approval'] = $this->session->user['approve_id']; // approved user
				$data['approve_status'] = 10; // approved
				$data['approve_date'] = date('Y-m-d h:i:s'); //approve date
			}
		}
		$quote->update($data, 'quote_id = ' . $quote_id);

		exit;
	}

	public function disapproveAction()
	{
		$quote_id = $this->getRequest()->getParam('id');
		if ($quote_id == null) {
			return false;
		}
		$quote = new Quote();
		$data['approve_status'] = -1; // disapproved
		$data['quote_approval'] = ''; // disapproved
		$quote->update($data, 'quote_id = ' . $quote_id);

		exit;
	}

	public function editAction()
	{
		$quote_id = $this->getRequest()->getParam('id');

		if ($quote_id == null) {
			$this->redirect('/');
		}


		$customer = new Customer();
		$sales = new User();
		$project = new Project();
		$quote = new Quote();
		$products = new ProductProject();

		$quote_detail = $quote->fetchquotebyid($quote_id);
		echo Zend_Json::encode($quote_detail);
		$project_detail = $project->fetchbyid($quote_detail['project_id']);


		$this->view->customer = $customer->fetchCustomerById($quote_detail['customer_id']);
		$this->view->quote = $quote_detail;
		$this->view->arch = $sales->fetchallsales();
		$this->view->approval = $sales->getQuoteapproval();
		$this->view->project = $project_detail;
		$this->view->type = $quote->fetchquotetype();
		$this->view->items = $products->fetchallitems($quote_id);

		if ($this->_request->isPost()) {
			$data = $this->_request->getPost();

			$model = new Quote();

			$result = $model->edit($data, $quote_id);
			$this->redirect('/quote/edit/id/' . $result);
		}
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
		$sales = new User();
		$project = new Project();
		$quote = new Quote();
		$products = new ProductProject();
		$item = new ItemsProject();

		$quote_detail = $quote->fetchquotebyid($quote_id);
		$project_detail = $project->fetchbyid($quote_detail['project_id']);

		$this->view->customer = $customer->fetchCustomerById($quote_detail['customer_id']);
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
