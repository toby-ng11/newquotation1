<?php

use Centura\Model\{ 
	Quote,
	Mail
};

class ExportController extends Zend_Controller_Action
{

    public function init()
    {
        /* Initialize action controller here */
    	$this->session =  Zend_Registry::get('session');
    	$this->file_appx = date('Y-m-d').'_';
    }
    
    private function getheader($company,$past_days)
    {
    	$model = new Quote();
    	
    	$result = $model->fetcsv(null,$past_days);
    	$header = array('Company','Customer','Contact','Job Name','Quote Expire Date','Quote_Number','Note','approve_date');
    	
    	$fp = fopen(APPLICATION_PATH . '/../tmp/'.$this->file_appx.'header.csv', 'w');
    	fputs($fp, $bom =( chr(0xEF) . chr(0xBB) . chr(0xBF) ));
    	
    	fputcsv($fp, $header);
    	foreach ($result as $fields) {
    		fputcsv($fp, $fields);
    	}
    	
    	fclose($fp);
    	
    	return true;
    }

    public function headerAction()
    {
    	$company = $this->getRequest()->getParam('company',null);
    	$past_days = $this->getRequest()->getParam('d',1);
    	
    	$this->getheader($company, $past_days);
  
        
        header('Content-type: application/octet-stream');
        header('Content-Disposition: attachment; filename="'.$this->file_appx.'header.csv'.'"');
        
        echo file_get_contents(APPLICATION_PATH . '/../tmp/'.$this->file_appx.'header.csv');
        
        $this->_helper->viewRenderer->setNoRender(true);
        $this->_helper->layout->disableLayout();
        
    }
    
    private function getlines($company,$past_days)
    {
    	$model = new Quote();
    	
    	$result = $model->fetchcsvitems(null,$past_days);
    	
    	$header = array('Item ID','Unit Qty','UOM','Unit_Price','Quote_Number','Sort ID','Note','approve_date');
    	
    	
    	$fp = fopen(APPLICATION_PATH . '/../tmp/'.$this->file_appx.'items.csv', 'w');
    	fputs($fp, $bom =( chr(0xEF) . chr(0xBB) . chr(0xBF) ));
    	
    	fputcsv($fp, $header);
    	foreach ($result as $fields) {
    		foreach($fields as $item)
    		{
    			fputcsv($fp, $item);
    		}
    	}
    	 
    	
    	fclose($fp);
    	
    	return true;
    	
    }
    
    
    public function linesAction()
    {
    	$company = $this->getRequest()->getParam('company',null);
    	$past_days = $this->getRequest()->getParam('d',1);

    	$this->getlines($company,$past_days);

        header('Content-type: application/octet-stream');
        header('Content-Disposition: attachment; filename="'.$this->file_appx.'items.csv'.'"');
        
         echo file_get_contents(APPLICATION_PATH . '/../tmp/'.$this->file_appx.'items.csv');
        
         $this->_helper->viewRenderer->setNoRender(true);
         $this->_helper->layout->disableLayout();
    }
    
    public function mailAction()
    {
    	$company = $this->getRequest()->getParam('company',null);
    	$past_days = $this->getRequest()->getParam('d',1);
    	
    	$this->getlines($company, $past_days);
    	
    	$this->getheader($company, $past_days);
    	
    	$files = array(
    		date('Y-m-d').'_'.'lines.csv'=>APPLICATION_PATH . '/../tmp/'.$this->file_appx.'items.csv',
    		date('Y-m-d').'_'.'headers.csv'=>APPLICATION_PATH . '/../tmp/'.$this->file_appx.'header.csv'
    			
    	);
    	$mail = new Mail();
    	
    	$mail->sendcsv($files);
    	
    	echo 'csv report sent successfully';
    	
    	$this->_helper->viewRenderer->setNoRender(true);
    	$this->_helper->layout->disableLayout();
    }
    

}

