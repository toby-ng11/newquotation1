<?php

use Centura\Model\{ 
	Customer,
	Project,
	Quote,
	Mail
};

class MailController extends Zend_Controller_Action
{

    public function init()
    {
        /* Initialize action controller here */
    }
    
    public function projectAction() //send project 
    {
    	$project_id = $this->getRequest()->getParam('id');
    	$project = new Project();
    	$project_detail = $project->fetchbyid($project_id);
    	$pdf_url = 'http://'.SITEURL.'/dompdf/print.php?url=http://'.SITEURL.'/project/print/id/'.$project_id."?company=".$this->getProjectCompany($project_detail);
    	
    	if ($this->_request->isXmlHttpRequest() && $this->_request->isPost() && $project_id != null)
    	{
    		$data = $this->_request->getPost();
    	
    	}
    }
    
    public function quoteAction() //send quote 
    {
    	$quote_id = $this->getRequest()->getParam('id');

    	$model= new Quote();
    	$customer = new Customer();
    	$mail = new Mail();
    	$project = new Project();
    	$quote_detail = $model->fetchquotebyid($quote_id);
    	$project_detail = $project->fetchbyid($quote_detail['project_id']);
    	
    	$pdf_url = 'http://'.SITEURL.'/dompdf/print.php?url=http://'.SITEURL.'/quote/print/id/'.$quote_id."?company=".$this->getCompany($quote_detail);
    	

    	$this->view->quote = $quote_detail;
    	$this->view->customer = $customer->fetchCustomerById($quote_detail['customer_id']);
    	$this->view->body = $mail->getcontent($quote_id, $project_detail['project_name']);
    	$this->view->subject = 'Quote For '.htmlspecialchars($project_detail['project_name'],ENT_QUOTES);
    	$this->view->preview =  'http://'.SITEURL.'/dompdf/print.php?url=http://'.SITEURL.'/quote/print/id/'.$quote_id."?company=".$this->getCompany($quote_detail);
    	
    	if ($this->_request->isPost() && $quote_id != null)
    	{
    		$data = $this->_request->getPost();
    		$data['project_name'] = substr(preg_replace("![^a-z0-9]+!i", '_', $project_detail['project_name']),0,10);
    		try {
    			$this->quotesend($data,$quote_id);
    		} catch (Exception $e) {
    			var_dump($e);exit;
    		}
    		
    		$this->redirect('/');
    		 
    	}
    }

    private function  quotesend($data,$id)
    {
    	if($id == null || $data['to'] == null)
    	{
    		return false;
    	}
    	if($data['from'] == null)
    	{
    		$data['from'] = 'quote@centura.ca';
    	}
	    	
        $mail = new Mail();
            
		    
		$url = 'http://'.SITEURL.'/dompdf/print.php?url=http://'.SITEURL.'/quote/print/id/'.$id."?company=".DEFAULT_COMPNAY;

		try {
		   $mail->send($id,$data['from'],$data['from_name'], $data['to'],$data['to_name'], $data['subject'], $data['body'],
		    				null,$data['from'],'Quote_'.$data['project_name'].'_'.$id.'.pdf',$url);
		} catch (Exception $e) {
		    var_dump($e);
		}
		    
    }
    
    private function getCompany($quote)
    {
    	if($quote == null)
    	{

    		return 'TOR';
    	}
    	else 
    	{
    		return substr($quote['quote_no'],0,3);
    	}
    }
    
    private function getProjectCompany($project)
    {
   		if($project == null)
    	{

    		return 'TOR';
    	}
    	else 
    	{
    		return substr($quote['quote_no'],0,3);
    	}
    }
    



}



