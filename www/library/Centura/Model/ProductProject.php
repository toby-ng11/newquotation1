<?php

namespace Centura\Model;

use Zend_Json;
use Zend_Registry;
use Zend_Date;
use Exception;

class ProductProject extends DbTable\Products
{
    
	public function add($data,$quote_id)
	{
		$this->session =  Zend_Registry::get('session');
	    if($data == null || $quote_id == null)
	    {
	        return  false;
	    }
	    
	    $db = $this->getAdapter();
	    $sort = 0;

		$i = array();

	    $i['quote_id'] = $quote_id;
	    $i['product_id'] = $data['product_id'];
	    $i['qty'] = $data['qty'];
	    $i['sort_id'] = $data['sort_id'];
	    $i['note'] =  trim($data['note']);
		$i['uom'] = $data['uom'];
	    $i['unit_price'] = $data['unit_price'];
	    $i['subtotal'] = $data['qty'] * $data['unit_price'];
		//$i['status'] = $data['status'];
		try {
	    	$db->insert('quote_items', $i);
	    } catch (Exception $e) {
	    	return $e->getMessage();
	    }

	    $i = null;
	    return true;
	}

	public function addsingle($data, $quote_id)
	{
		$this->session =  Zend_Registry::get('session');
	    if($data == null || $quote_id == null)
	    {
	        return  false;
	    }
	    
	    $db = $this->getAdapter();
	    $sort = 0;
	    
	  
	    $i['quote_id'] = $quote_id;
	    $i['product_id'] = $data['item_id'];
	    $i['qty'] = $data['qty'];
	    $i['note'] = trim($data['note']);
	    $i['unit_price'] = $data['price'];
	    $i['uom'] = $data['uom'];
	    $i['subtotal'] = $data['qty'] * $data['price'];
	    //$i['editor'] = $this->session->user['id'];
		$timestamp = Zend_Date::now()->get(Zend_Date::TIMESTAMP);
	    $i['sort_id'] = Zend_Date::now()->get(Zend_Date::TIMESTAMP);
	    try {
	    	$db->insert('quote_items', $i);
	    } catch (Exception $e) {
	    	return $e->getMessage();
	    }
	   
	    return true;
	    
	}

	public function edititem($data, $quote_id)
	{
		$this->session =  Zend_Registry::get('session');
		if($data == null || $quote_id == null)
		{
			return  false;
		}

		$db = $this->getAdapter();
		$sort = 0;
		$i['quote_id'] = $quote_id;
		$i['product_id'] = $data['item_id'];
		$i['qty'] = $data['qty'];
		$i['note'] = $data['note'];
		$i['unit_price'] = $data['price'];
		$i['uom'] = $data['uom'];
		$i['subtotal'] = $data['qty'] * $data['price'];
		//$i['editor'] = $this->session->user['id'];

		try {
			$sql = $db->select()->from('quote_items')
				->where('quote_id = ?', $quote_id)
				->where('product_id = ?', $data['old_item_id'])
				->where('qty = ?', $data['old_qty'])
				->where('sort_id = ?', $data['sort_id'])
				->where('uom = ?', $data['old_uom'])
				->where('unit_price = ?', $data['old_price'])
				//->where('note = ?', $data['old_note']) // text = varchar error
				->where('status = 1')
				->limit(1);
			$product = $db->fetchRow($sql);
			$db->update('quote_items', $i, implode(' ', $sql->getPart('where')));

		} catch (Exception $e) {
			echo $e->getMessage();
			return false;
		}
		return true;
	}
	
	public function addwithsort($data,$quote_id)
	{
	
		if($data == null || $quote_id == null)
		{
			return  false;
		}
		 
		$db = $this->getAdapter();
		$sort = 0;
		foreach ($data as $item_id=>$item)
		{
			foreach($item['uom'] as $k=>$v)
			{
				$i['quote_id'] = $quote_id;
				$i['product_id'] = $item_id;
				$i['qty'] = $item['qty'][$k];
				if($item['sort'][$k] != null && is_numeric($item['sort'][$k]))
				{
					$i['sort_id'] = $item['sort'][$k];
				}
				else
				{
					$i['sort_id'] = $sort;
				}
				
				$i['note'] = $item['note'][$k];
				$i['unit_price'] = $item['unit_price'][$k];
				$i['note'] = $item['note'][$k];
				$i['uom'] =$item['uom'][$k];
				$i['subtotal'] = $item['total_price'][$k];
				$sort++;
				$db->insert('quote_items', $i);
				$i = null;
			}
		}
		 
		return true;
		 
	}
	
	public function refresh($quote_id)
	{
		if($quote_id == null)
		{
			return  false;
		}
		
		
	}
	
	public function remove($quote_id, $item_id, $uom, $price, $qty, $sort_id)
	{
		if($quote_id == null)
		{
			return  false;
		}
		$db = $this->getAdapter();
		//$data['status'] = 0 ;
		$sql = $db->select()->from('quote_items',null)
			->where('quote_id = ?',$quote_id)
			->where('product_id = ?',$item_id)
			->where('qty = ?',$qty)
			->where('sort_id = ?', $sort_id)
			->where('uom = ?',$uom)
			->where('unit_price=?',$price);

		try {
			//$db->update('quote_items', $data, implode(' ', $sql->getPart('where')));
			$db->delete('quote_items', implode(' ', $sql->getPart('where')));
		} catch (Exception $e) {
			error_log($e);
			return false;
		}
		return true;
		
	}
	
	public function edit($data,$quote_id)
	{
		if($quote_id == null)
		{
			return  false;
		}
		
		$this->remove($quote_id);
		
		$this->addwithsort($data, $quote_id);
		
		return true;
	}
	
	public function fetchallitems($quote_id)
	{
		if($quote_id == null)
		{
			return  false;
		}
		$db = $this->getAdapter();
		
		$select = $db->select()->from('quote_items')->where('quote_id =?',$quote_id)->order('sort_id asc')->where('status = 1')
			->join('P21_Items', 'quote_items.product_id = P21_Items.item_id','item_desc');
		
		return $db->fetchAll($select);
	}

	public function fetchallitemsJson($quote_id)
	{
		if($quote_id == null)
		{
			return  false;
		}
		$db = $this->getAdapter();
		
		$select = $db->select()->from('quote_items')->where('quote_id =?',$quote_id)->order('sort_id asc')->where('status = 1')
			->join('P21_Items', 'quote_items.product_id = P21_Items.item_id','item_desc');
		
		return Zend_Json::encode($db->fetchAll($select));
	}


	public function fetchallitemslive($quote_id)
	{
		if($quote_id == null)
		{
			return  false;
		}
		$db = $this->getAdapter();
		if(DEFAULT_COMPNAY_ID == null)
		{
			$company = 'TOR';
		}
		$company = DEFAULT_COMPNAY_ID;
	
		$select = $db->select()->from('quote_items')->where('quote_id =?',$quote_id)->order('sort_id asc')->where('status = 1')
		//->join('P21_Items', 'quote_items.product_id = P21_Items.item_id','item_desc')
		->join('P21_Item_UOM_Price_Conversion', 'quote_items.product_id = P21_Item_UOM_Price_Conversion.item_id and quote_items.uom = P21_Item_UOM_Price_Conversion.unit_of_measure',
				array('item_desc','initprice'=>'P21_Cost'))->where('P21_Item_UOM_Price_Conversion.location_id = ?',$company);
		
		
		return $db->fetchAll($select);
	}
	
	public function fetchallitemsbyprojectid($project_id)
	{
		if($project_id == null)
		{
			return  false;
		}
		$db = $this->getAdapter();
		
		$select = $db->select()->from('quote_items')->join('quote','quote.quote_id = quote_items.quote_id',null)->where('project_id =?',$project_id)->order('sort_id asc')->where('quote_items.status = 1')
		->join('P21_Items', 'quote_items.product_id = P21_Items.item_id','item_desc');
		
		return $db->fetchAll($select);
	}

	public function fetchallitemsbyprojectidJson($project_id)
	{
		if($project_id == null)
		{
			return  false;
		}
		$db = $this->getAdapter();
		
		$select = $db->select()->from('quote_items')->join('quote','quote.quote_id = quote_items.quote_id',null)->where('project_id =?',$project_id)->order('sort_id asc')->where('quote_items.status = 1')
		->join('P21_Items', 'quote_items.product_id = P21_Items.item_id','item_desc');
		
		return Zend_Json::encode($db->fetchAll($select));
	}
	
}

