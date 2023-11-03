<?php

class MomoController extends Zend_Controller_Action
{

    public function init()
    {
    
    }

    public function indexAction()
    {
    	$model = new Zend_Db_Table();
    	
    	$db = $model->getAdapter();
    	
    	$select = $db->select()->from('quote_specifier','Specifier');
    	
    	$rows = $db->fetchAll($select);
    	
    	$rows=array_values($rows);
    	
    	foreach ($rows as $r)
    	{
    		$data[]=$r['Specifier'];
    	}
    	
    	$data = (array_unique($data));
    	
    	foreach ($data as $d)
    	{
    		$info['Specifier'] = $d;
    		$info['DeleteFlag'] = 'N';
    		$info['Company_ID'] = 'TOR';
    		$db->insert('quote_specifier_copy', $info);
    	}
        
    }
   

}

