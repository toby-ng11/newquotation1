<?php

namespace Centura\Model;

use Zend_Registry;
use Zend_Date;
use Exception;
use Zend_Db;
use Zend_Json;
use Zend_Db_Expr;

class ItemsProject extends DbTable\Products
{
    
	public function add($data,$project_id)
	{
		$this->session =  Zend_Registry::get('session');
	    if($data == null || $project_id == null)
	    {
	        return  false;
	    }
	    
	    $db = $this->getAdapter();
	    $sort = 0;
	    
	  
	    $i['project_id'] = $project_id;
	    $i['item_id'] = $data['item_id'];
	    $i['quantity'] = $data['qty'];
	    $i['note'] = trim($data['note']);
	    $i['unit_price'] = $data['price'];
	    $i['uom'] = $data['uom'];
	    $i['subtotal'] = round($data['qty'] * $data['price'],2);
	    $i['added_by'] = $this->session->user['id'];
		$i['last_maintained_by'] = $this->session->user['id'];
		$i['date_add'] = new Zend_Db_Expr('GETDATE()');
		$i['date_last_maintained'] = new Zend_Db_Expr('GETDATE()');
		$i['delete_flag'] = 'N';
	    try {
	    	$db->insert('project_items', $i);
	    } catch (Exception $e) {
	    	error_log($e->getMessage(), 0); 	
	    	return false;
	    }
	   
	    return true;
	    
	}
	
	public function edititem($data, $item_uid)
	{
		if($data == null || $item_uid == null) {
			return false;
		}

		$this->session =  Zend_Registry::get('session');
		$db = $this->getAdapter();

		$i['item_id'] = $data['item_id'];
		$i['quantity'] = $data['qty'];
		$i['note'] = trim($data['note']);
		$i['unit_price'] = $data['price'];
		$i['uom'] = $data['uom'];
		$i['subtotal'] = $data['qty'] * $data['price'];
		$i['last_maintained_by'] = $this->session->user['id'];
		$i['date_last_maintained'] = new Zend_Db_Expr('GETDATE()');

		try {
			$db->update('project_items', $i, 'item_uid = '.$item_uid);

		} catch (Exception $e) {
			error_log($e->getMessage(), 0);
			return false;
		}
	
		return true;
	}
	
	public function remove($item_uid)
	{
		if($item_uid == null) {
			return  false;
		}

		$this->session =  Zend_Registry::get('session');
		$db = $this->getAdapter();

		$data['delete_flag'] = 'Y';
		$data['last_maintained_by'] = $this->session->user['id'];
		$data['date_last_maintained'] = new Zend_Db_Expr('GETDATE()');

		$db->update('project_items', $data, 'item_uid = '.$item_uid);
		
		return true;
	}
	
	public function edit($data,$project_id)
	{
		if($project_id == null)
		{
			return  false;
		}
		
		$this->remove($project_id);
		
		$this->add($data, $project_id);
		
		return true;
	}
	
	public function fetchallitems($project_id)
	{
		if($project_id == null)
		{
			return  false;
		}
		$db = $this->getAdapter();
		
		$select = $db->select()
			->from('p2q_view_project_items')
			->where('project_id =?',$project_id);
		return $db->fetchAll($select);
	}

	public function fetchallitemsJson($project_id)
	{
		if($project_id == null)
		{
			return  false;
		}
		$db = $this->getAdapter();
		
		$select = $db->select()
			->from('p2q_view_project_items')
			->where('location_id = ?',DEFAULT_COMPNAY_ID)
			->where('project_id =?',$project_id);
		return Zend_Json::encode($db->fetchAll($select));
	}
}

