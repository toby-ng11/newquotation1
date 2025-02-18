<?php

use Centura\Model\{ 
	Customer,
	Specifier, 
	User,
	Quote, 
	Location, 
	Project, 
	ProductProject, 
	ProjectNote, 
	ItemsProject
};

class ProjectController extends Zend_Controller_Action
{

    public function init()
    {
        /* Initialize action controller here */
    	$this->session =  Zend_Registry::get('session');
	  /* 	 if($this->session->user['sale_role'] != 'manager' && APPLICATION_ENV == 'production' && $this->_request->getActionName() != 'view' && $this->_request->getActionName() != 'print')
	      {
	      	$this->_redirect('/permission');
	      }
	  */
	    
    }

    public function indexAction()
    {
		$this->view->headTitle()->set('Add Project');

        $db = new User();
        
        $model = new Quote();
		$project = new Project();
        $this->view->seg = $project->fetchProjectSegment();
        //$this->view->sepc = $model->fetchsepc();

		$this->view->status = $project->fetchProjectStatus();

        $sales = new User();
        $this->view->arch = $sales->fetchallsales();
        
        $locations = new Location();
        $this->view->locations = $locations->fetchAllBranches();
    }
    
    public function saveAction()
    {
    	if ($this->_request->isPost())
    	{
    		$data = $this->_request->getPost();
    		
    		$model = new Project();
    		
    		$result = $model->save($data);
    		
    		$this->redirect('/project/edit/id/'.$result);
    		exit;
    	}
    }

	public function noteAction() {
		$project_id = $this->getRequest()->getParam('id');
		$note = new ProjectNote();
    	echo $note->fetchProjectNote($project_id, true);
		exit;
	}

	public function itemAction() {
		$project_id = $this->getRequest()->getParam('id');
		$item = new ItemsProject();
    	echo $item->fetchallitems($project_id, true);
		exit;
	}
    
    public function editAction()
    {
    	$project_id = $this->getRequest()->getParam('id');
		
    	if($project_id == null)
    	{
    		$this->redirect('/project');
    	}
    	
    	$project = new Project();
		$specifier = new Specifier();
    	$quote = new Quote();

		$project_detail = $project->fetchbyid($project_id);
		//echo Zend_Json::encode($project_detail);
		$this->view->project = $project_detail;

		$this->view->headTitle()->set('Project Edit: ' . $project_id . ' - '. $project_detail['project_name']);
    
    	$this->view->status = $project->fetchProjectStatus();
    	$this->view->seg = $project->fetchProjectSegment();
    	//$this->view->sepc = $quote->fetchsepc();
    	$sales = new User();
        $this->view->arch = $sales->fetchallsales();

    	
    	$customer = new Customer();
    	
    	if($project_detail['status'] == 13)//Project closed
    	{
    		$this->redirect('/project/view/id/'.$project_id);
    	}
    	
		$locations = new Location();
    	$this->view->locations = $locations->fetchAllBranches();
    	$this->view->specifier = $specifier->fetchspecbyid($project_detail['specifier_id']);
    	$this->view->architect = $specifier->fetchspecbyid($project_detail['architect_id']);
    	$this->view->gerneral_contractor = $customer->fetchCustomerById($project_detail['general_contractor_id']);
    	$this->view->awarded_sub_contracotr = $customer->fetchCustomerById($project_detail['awarded_contractor_id']);
    	//$this->view->log = $project->fetchlogbyid($project_id);
    	
    	//$product = new ProductProject();
    	
    	//$this->view->items = $product->fetchallitemsbyprojectid($project_id);
    	
    	$mono = new ProjectNote();
    	$this->view->memo = $mono->fetchProjectNote($project_id);
    	//$this->view->memo_type = $mono->fetchalltypes();
    	
    	if($this->session->user['id'] != $project_detail['shared_id'] and $this->session->user['id'] != $project_detail['owner_id'] && APPLICATION_ENV == 'production' && $this->session->user['sale_role'] != 'admin' && $this->session->user['approve_id'] == null)
    	{
    		$this->view->owner = 0;
    	}
    	else
    	{
    		$this->view->owner = 1;
    	}
    	
    	if ($this->_request->isPost())
    	{
    		$data = $this->_request->getPost();
    
    		$model = new Project();
    
    		$result = $model->edit($data,$project_id);
    		if($result == true)
    		{
    			$this->redirect('/project/edit/id/'.$project_id);
    		}
    		else {
    			echo 'false';
    		}
    	}
    }
    
    public function viewAction()
    {
    	$project_id = $this->getRequest()->getParam('id');
    	 
    	if($project_id == null)
    	{
    		$this->redirect('/project');
    	}
    	
    	$quote = new Quote();
		$project = new Project();

    	$this->view->seg = $project->fetchProjectSegment();
    	//$this->view->sepc = $quote->fetchsepc();
    	$sales = new User();
    	
    	$locations = new Location();
    	$this->view->locations = $locations->fetchAllBranches();
    	 
    	$customer = new Customer();
    	 
    	$project_detail = $project->fetchbyid($project_id);
		
    	$this->view->project = $project_detail;
		$this->view->status = $project->fetchProjectStatus();
    	$this->view->spec_name = $project->fetchspecbyid($project_detail['specifiler']);
    	$this->view->arch_name = $project->fetchspecbyid($project_detail['architect']);
    	
    	$this->view->architect = $project->fetchspec($project_detail['architect']);
    	//$this->view->arch = $sales->fetchallsales($this->view->architect['default_company']);
    	$this->view->sepcloc = $quote->fetchsepcloc($project_detail['specifiler']);
    	 
    	$this->view->gerneral_contractor = $customer->fetchCustomerById($project_detail['general_contractor_id']);
    	$this->view->awarded_sub_contracotr = $customer->fetchCustomerById($project_detail['awarded_sub_contracotr_id']);
    	$this->view->log = $project->fetchlogbyid($project_id);
    	
    	//$product = new ProductProject();
    	 
    	//$this->view->items = $product->fetchallitemsbyprojectid($project_id); 
    	
    	$mono = new ProjectNote();
    	$this->view->memo = $mono->fetchProjectNote($project_id);
    	//$this->view->memo_type = $mono->fetchalltypes();
    	
    	$item = new ItemsProject();
    	//$this->view->items = $item->fetchallitems($project_id);
    	 
    }
    
    public function printAction()
    {
    	$project_id = $this->getRequest()->getParam('id');
    
    	if($project_id == null)
    	{
    		$this->redirect('/project');
    	}
    	 
    	$quote = new Quote();
		$specifier = new Specifier();
		$project = new Project();

    	$this->view->seg = $project->fetchProjectSegment();
    	$sales = new User();
    	 
    	$locations = new Location();
    	$this->view->locations = $locations->fetchAllBranches();

    	$customer = new Customer();
    
    	$project_detail = $project->fetchbyid($project_id);
    	$this->view->project = $project_detail;
		$this->view->status = $project->fetchProjectStatus();
    	$this->view->spec_name = $specifier->fetchspecbyid($project_detail['specifiler']);
    	$this->view->arch_name = $specifier->fetchspecbyid($project_detail['architect']);
    	 
    	$this->view->architect = $project->fetchspec($project_detail['architect']);
    	//$this->view->arch = $sales->fetchallsales($this->view->architect['default_company']);
    	$this->view->sepcloc = $quote->fetchsepcloc($project_detail['specifiler']);
    
    	$this->view->gerneral_contractor = $customer->fetchCustomerById($project_detail['general_contractor_id']);
    	$this->view->awarded_sub_contracotr = $customer->fetchCustomerById($project_detail['awarded_sub_contracotr_id']);
    	$this->view->log = $project->fetchlogbyid($project_id);
    	
    	$mono = new ProjectNote();
    	$this->view->memo = $mono->fetchProjectNote($project_id);
    
    	$item = new ItemsProject();
    	$this->view->items = $item->fetchallitems($project_id);
    	$this->_helper->layout->setLayout('print');
    	$this->render('print'.'-'.DEFAULT_COMPNAY);
    }
    
    public function deleteAction()
    {
    	$project_id = $this->getRequest()->getParam('id');
    	$project = new Project();
    	
    	$project->remove($project_id);
    	exit;
    }

    public function additemAction()
    { 
    	$project_id = $this->getRequest()->getParam('pro');
    
    	if ($this->_request->isXmlHttpRequest() && $this->_request->isPost() && $project_id != null)
    	{
    		$data = $this->_request->getPost();
    
    		$item = new ItemsProject();
    		echo $item->add( $data,$project_id);
    
    	}
    	else
    	{
    		echo '0';
    	}
    	 
    	exit;
    }
    
    public function edititemAction()
    {
    	$item_uid = $this->getRequest()->getParam('uid');
    
    	if ($this->_request->isXmlHttpRequest() && $this->_request->isPost() && $item_uid != null) {
    		$data = $this->_request->getPost();
    		$item = new ItemsProject();
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
    		$item = new ItemsProject();
    		echo $item->remove($item_uid);
    	}
    	else {
    		echo '0';
    	}
    
    	exit;
    }

	public function quoteAction() {
		$project_id = $this->getRequest()->getParam('id');
		$quotes = new Quote();
		echo $quotes->fetchQuoteByProjectId($project_id);
		exit; 
	}

}

