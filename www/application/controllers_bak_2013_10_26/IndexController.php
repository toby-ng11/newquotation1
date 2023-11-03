<?php

class IndexController extends Zend_Controller_Action
{

    public function init()
    {
        /* Initialize action controller here */
        $this->session =  Zend_Registry::get('session');
        if(APPLICATION_ENV == 'production')
        {
        	$this->sale_id = $this->session->user['id'];
        }
        else {
        	$this->sale_id = 'TORTESTSALESMGR001';
        }
    }

    public function indexAction()
    {
     
      if($this->session->user['approve_id'] != null && APPLICATION_ENV == 'production' && $this->_getParam('normal') == null )
      {
      		$this->_redirect('/index/approval');
      }
     
      if($this->session->user['sale_role'] == 'admin' && APPLICATION_ENV == 'production' && $this->_getParam('normal') == null)
      {
      	$this->_redirect('/index/admin');
      }
      $project = new Centura_Model_Project();
      $quote = new Centura_Model_Quote();
      $memo = new Centura_Model_ProjectMemo();
      
      $this->view->ownproject = $project->fetchbyowner($this->sale_id);
      $this->view->ownquotes = $quote->fetchrelated($this->sale_id);
      
      $this->view->memo = $memo->fetchmemobyowner($this->sale_id); 
      
      if($this->session->user['approve_id'] != null )
      {
       	$this->view->otherprojects = $project->fetchothers($this->sale_id,$this->session->user['location_id']);
      }
    }
    
    public function adminAction()
    {
    	if($this->session->user['sale_role'] != 'admin' && APPLICATION_ENV == 'production' )
    	{
    		$this->_redirect('/index/');
    	}
    	
    	$quote = new Centura_Model_Quote();
    	$project = new Centura_Model_Project();
    	
    	$this->view->ownproject = $quote->fetchtotal();
    	$this->view->log = null;
    	$this->view->projects = $project->fetchallproject();
    }
    public function approvalAction()
    {
    	if($this->session->user['approve_id'] == null && APPLICATION_ENV == 'production')
    	{
    		$this->_redirect('/index');
    	}
    	$quote = new Centura_Model_Quote();
    	$project = new Centura_Model_Project();
    	 
    	$this->view->waiting = $quote->fetchwaiting(1);
    	$this->view->approved = $quote->fetchwaiting(10);
    	$this->view->disapproved = $quote->fetchwaiting(-1);
    }


}

