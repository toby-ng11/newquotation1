<?php

namespace Centura\Model;

use Zend_Json;
use Zend_Registry;
use Zend_Date;
use Zend_Db_Expr;
use Exception;

class ProductProject extends DbTable\Products
{
    
	public function add($data, $quote_id)
	{
		$session =  Zend_Registry::get('session');
	    if($data == null || $quote_id == null)
	    {
	        return  false;
	    }
	    
	    $db = $this->getAdapter();

		$i = array();

	    $i['quote_id'] = $quote_id;
	    $i['item_id'] = $data['item_id'];
		$i['uom'] = $data['uom'];
	    $i['quantity'] = $data['qty'];
		$i['unit_price'] = $data['price'];
		$i['subtotal'] = round($data['qty'] * $data['price'], 2);
	    $i['note'] =  trim($data['note']);
		$i['added_by'] = $session->user['id'];
		$i['last_maintained_by'] = $session->user['id'];
		$i['date_add'] = new Zend_Db_Expr('GETDATE()');
		$i['date_last_maintained'] = new Zend_Db_Expr('GETDATE()');
		$i['delete_flag'] = 'N';
		try {
	    	$db->insert('quote_items', $i);
	    } catch (Exception $e) {
	    	error_log($e->getMessage());
			return false;
	    }

	    $i = null;
	    return true;
	}

	public function edititem($data, $item_uid)
	{
		$session =  Zend_Registry::get('session');
		if($data == null || $item_uid == null)
		{
			return  false;
		}

		$db = $this->getAdapter();

		$i['item_id'] = $data['item_id'];
		$i['quantity'] = $data['qty'];
		$i['note'] = trim($data['note']);
		$i['unit_price'] = $data['price'];
		$i['uom'] = $data['uom'];
		$i['subtotal'] = $data['qty'] * $data['price'];
		$i['last_maintained_by'] = $session->user['id'];
		$i['date_last_maintained'] = new Zend_Db_Expr('GETDATE()');

		try {
			$db->update('quote_items', $i, 'item_uid = '.$item_uid);
			return true;
		} catch (Exception $e) {
			error_log($e->getMessage());
			return false;
		}
	}
	
	public function remove($item_uid)
	{
		if($item_uid == null) {
			return  false;
		}

		$session =  Zend_Registry::get('session');
		$db = $this->getAdapter();

		$data['delete_flag'] = 'Y';
		$data['last_maintained_by'] = $session->user['id'];
		$data['date_last_maintained'] = new Zend_Db_Expr('GETDATE()');

		try {
			$db->update('quote_items', $data, 'item_uid = '.$item_uid);
		} catch (Exception $e) {
			error_log($e->getMessage());
			return false;
		}
		
		return true;
	}
	
	public function fetchallitems($project_id, $Json = false)
	{
		if($project_id == null)
		{
			return  false;
		}
		$db = $this->getAdapter();
		
		$select = $db->select()
			->from('p2q_view_quote_items')
			->where('location_id = ?',DEFAULT_COMPNAY_ID)
			->where('quote_id =?',$project_id);

		if($Json)
		{
			return Zend_Json::encode($db->fetchAll($select));
		} else {
			return $db->fetchAll($select);
		}
	}
}



