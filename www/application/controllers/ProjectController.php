<?php

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
        $db = new Centura_Model_DbTable_User();
        
        $model = new Centura_Model_Quote();
        
        $this->view->status = $model->fetchstatus();
        $this->view->seg = $model->fetchseg();
        $this->view->sepc = $model->fetchsepc();
        $sales = new Centura_Model_User();
        
        $this->view->arch = $sales->fetchallsales();
        
        $locations = new Centura_Model_Location();
        $this->view->locations = $locations->fetchAllBranches();
    }
    
    public function saveAction()
    {
    	if ($this->_request->isPost())
    	{
    		$data = $this->_request->getPost();
    		
    		$model = new Centura_Model_Project();
    		
    		$result = $model->save($data);
    		
    		$this->redirect('/project/edit/id/'.$result);
    		exit;
    	}
    }
    
    
    public function editAction()
    {
    	$project_id = $this->getRequest()->getParam('id');
    	
    	if($project_id == null)
    	{
    		$this->redirect('/project');
    	}
    	
    	
    	$quote = new Centura_Model_Quote();
    
    	$this->view->status = $quote->fetchstatus();
    	$this->view->seg = $quote->fetchseg();
    	$this->view->sepc = $quote->fetchsepc();
    	$sales = new Centura_Model_User();
    
    	$locations = new Centura_Model_Location();
    	$this->view->locations = $locations->fetchAllBranches();
    	
    	$project = new Centura_Model_Project();
    	$customer = new Centura_Model_Customer();
    	
    	$project_detail = $project->fetchbyid($project_id);
    	
    	if($project_detail['status'] == 13)//Project closed
    	{
    		$this->redirect('/project/view/id/'.$project_id);
    	}
    	
    	
    	$this->view->project = $project_detail;
    	$this->view->spec_name = $project->fetchspecbyid($project_detail['specifiler']);
    	$this->view->arch_name = $project->fetchspecbyid($project_detail['architect']);
    	
    	$this->view->architect = $project->fetchspec($project_detail['architect']);
    	$this->view->arch = $sales->fetchallsales($this->view->architect['default_company']);
    	$this->view->sepcloc = $quote->fetchsepcloc($project_detail['specifiler']);
    	
    	$this->view->gerneral_contractor = $customer->fetchCustomerById($project_detail['general_contractor_id']);
    	$this->view->awarded_sub_contracotr = $customer->fetchCustomerById($project_detail['awarded_sub_contracotr_id']);
    	//$this->view->log = $project->fetchlogbyid($project_id);
    	
    	$product = new Centura_Model_ProductProject();
    	
    	$this->view->items = $product->fetchallitemsbyprojectid($project_id);
    	
    	$mono = new Centura_Model_ProjectMemo();
    	$this->view->memo = $mono->fetchmemosbyproject($project_id);
    	//$this->view->memo_type = $mono->fetchalltypes();
    	
    	$item = new Centura_Model_ItemsProject();
    	$this->view->items = $item->fetchallitems($project_id);
    	
    	if($this->session->user['id'] != $project_detail['owner'] && APPLICATION_ENV == 'production' && $this->session->user['sale_role'] != 'admin' && $this->session->user['approve_id'] == null)
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
    
    		$model = new Centura_Model_Project();
    
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
    	
    	$quote = new Centura_Model_Quote();
    	
    	$this->view->status = $quote->fetchstatus();
    	$this->view->seg = $quote->fetchseg();
    	$this->view->sepc = $quote->fetchsepc();
    	$sales = new Centura_Model_User();
    	
    	$locations = new Centura_Model_Location();
    	$this->view->locations = $locations->fetchAllBranches();
    	 
    	$project = new Centura_Model_Project();
    	$customer = new Centura_Model_Customer();
    	 
    	$project_detail = $project->fetchbyid($project_id);
    	$this->view->project = $project_detail;
    	$this->view->spec_name = $project->fetchspecbyid($project_detail['specifiler']);
    	$this->view->arch_name = $project->fetchspecbyid($project_detail['architect']);
    	
    	$this->view->architect = $project->fetchspec($project_detail['architect']);
    	$this->view->arch = $sales->fetchallsales($this->view->architect['default_company']);
    	$this->view->sepcloc = $quote->fetchsepcloc($project_detail['specifiler']);
    	 
    	$this->view->gerneral_contractor = $customer->fetchCustomerById($project_detail['general_contractor_id']);
    	$this->view->awarded_sub_contracotr = $customer->fetchCustomerById($project_detail['awarded_sub_contracotr_id']);
    	$this->view->log = $project->fetchlogbyid($project_id);
    	
    	$product = new Centura_Model_ProductProject();
    	 
    	$this->view->items = $product->fetchallitemsbyprojectid($project_id); 
    	
    	$mono = new Centura_Model_ProjectMemo();
    	$this->view->memo = $mono->fetchmemosbyproject($project_id);
    	//$this->view->memo_type = $mono->fetchalltypes();
    	
    	$item = new Centura_Model_ItemsProject();
    	$this->view->items = $item->fetchallitems($project_id);
    	 
    }
    
    public function printAction()
    {
    	$project_id = $this->getRequest()->getParam('id');
    
    	if($project_id == null)
    	{
    		$this->redirect('/project');
    	}
    	 
    	$quote = new Centura_Model_Quote();
    	 
    	$this->view->status = $quote->fetchstatus();
    	$this->view->seg = $quote->fetchseg();
    	$this->view->sepc = $quote->fetchsepc();
    	$sales = new Centura_Model_User();
    	 
    	$locations = new Centura_Model_Location();
    	$this->view->locations = $locations->fetchAllBranches();
    
    	$project = new Centura_Model_Project();
    	$customer = new Centura_Model_Customer();
    
    	$project_detail = $project->fetchbyid($project_id);
    	$this->view->project = $project_detail;
    	$this->view->spec_name = $project->fetchspecbyid($project_detail['specifiler']);
    	$this->view->arch_name = $project->fetchspecbyid($project_detail['architect']);
    	 
    	$this->view->architect = $project->fetchspec($project_detail['architect']);
    	$this->view->arch = $sales->fetchallsales($this->view->architect['default_company']);
    	$this->view->sepcloc = $quote->fetchsepcloc($project_detail['specifiler']);
    
    	$this->view->gerneral_contractor = $customer->fetchCustomerById($project_detail['general_contractor_id']);
    	$this->view->awarded_sub_contracotr = $customer->fetchCustomerById($project_detail['awarded_sub_contracotr_id']);
    	$this->view->log = $project->fetchlogbyid($project_id);
    	
    	$mono = new Centura_Model_ProjectMemo();
    	$this->view->memo = $mono->fetchmemosbyproject($project_id);
    
    	$item = new Centura_Model_ItemsProject();
    	$this->view->items = $item->fetchallitems($project_id);
    	$this->_helper->layout->setLayout('print');
    	$this->render('print'.'-'.DEFAULT_COMPNAY);
    }
    
    public function deleteAction()
    {
    	$project_id = $this->getRequest()->getParam('id');
    	$project = new Centura_Model_Project();
    	
    	$project->remove($project_id);
    	exit;
    }

    public function additemAction()
    { 
    	$project_id = $this->getRequest()->getParam('pro');
    
    	if ($this->_request->isXmlHttpRequest() && $this->_request->isPost() && $project_id != null)
    	{
    		$data = $this->_request->getPost();
    
    		$item = new Centura_Model_ItemsProject();
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
    	$project_id = $this->getRequest()->getParam('pro');
    
    	if ($this->_request->isXmlHttpRequest() && $this->_request->isPost() && $project_id != null)
    	{
    		
    		$data = $this->_request->getPost();
    		$item = new Centura_Model_ItemsProject();
    		echo $item->edititem( $data,$project_id);
    
    	}
    	else
    	{
    		echo '0';
    	}
    
    	exit;
    }
    
    public function deleteitemAction()
    {
    	$project_id = $this->getRequest()->getParam('pro');
    	$item_id = $this->getRequest()->getParam('item');
    	$price = $this->getRequest()->getParam('price');
    	$qty = $this->getRequest()->getParam('qty');
    	$uom  = $this->getRequest()->getParam('uom');
    	
    	if ($project_id != null && $item_id != null)
    	{
    		$item = new Centura_Model_ItemsProject();
    		echo $item->remove($project_id,$item_id,$uom,$price,$qty);
    	}
    	else
    	{
    		echo '0';
    	}
    
    	exit;
    }

}

