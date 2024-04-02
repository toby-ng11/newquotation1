<?php

namespace Centura\Model;

use Zend_Registry;
use Zend_Date;
use Exception;
use Zend_Json;

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
	    $i['product_id'] = $data['item_id'];
	    $i['qty'] = $data['qty'];
	    $i['note'] = $data['note'];
	    $i['unit_price'] = $data['price'];
	    $i['uom'] = $data['uom'];
	    $i['subtotal'] = $data['qty'] * $data['price'];
	    $i['editor'] = $this->session->user['id'];
	    $i['sort_id'] = Zend_Date::now()->get(Zend_Date::TIMESTAMP);
	    try {
	    	$db->insert('projects_products', $i);
	    } catch (Exception $e) {
	    	
	    	return false;
	    }
	   
	    return true;
	    
	}
	
	public function edititem($data,$project_id)
	{
		$this->session =  Zend_Registry::get('session');
		if($data == null || $project_id == null)
		{
			return  false;
		}

		$db = $this->getAdapter();
		$sort = 0;
		$i['project_id'] = $project_id;
		$i['product_id'] = $data['item_id'];
		$i['qty'] = $data['qty'];
		$i['note'] = $data['note'];
		$i['unit_price'] = $data['price'];
		$i['uom'] = $data['uom'];
		$i['subtotal'] = $data['qty'] * $data['price'];
		$i['editor'] = $this->session->user['id'];


		try {
			$sql = $db->select()->from('projects_products')->where('product_id = ?',$data['old_item_id'])->where('qty = ?',$data['old_qty'])->where('uom = ?',$data['old_uom'])
			->where('unit_price=?',$data['old_price'])->where('note=?',$data['old_note'])->where('status = 1')->limit(1);
			$product = $db->fetchRow($sql);
			$id = $product['id'];
			$db->update('projects_products', $i,implode(' ', $sql->getPart('where')).' and id = '.$id);

		} catch (Exception $e) {
			var_dump($e);
			exit;
			return false;
		}
	
		return true;
		 
	}
	
	public function refresh($project_id)
	{
		if($project_id == null)
		{
			return  false;
		}
		
	}
	
	public function remove($project_id,$item_id,$uom,$price,$qty)
	{
		if($project_id == null && $item_id != null)
		{
			return  false;
		}
		$db = $this->getAdapter();
		$data['status'] = 0;
		$sql = $db->select()->from('projects_products',null)->where('project_id = ?',$project_id)->where('product_id = ?',$item_id)->where('qty = ?',$qty)->where('uom = ?',$uom)
			->where('unit_price=?',$price);;
		
		$db->update('projects_products',$data,implode(' ', $sql->getPart('where')));
		
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
		
		$select = $db->select()->from('projects_products')->where('project_id =?',$project_id)->order('sort_id asc')->where('status = 1')
			->join('P21_Inv_Mast', 'projects_products.product_id = P21_Inv_Mast.item_id','item_desc');
		
		return $db->fetchAll($select);
	}

	public function fetchallitemsJson($project_id)
	{
		if($project_id == null)
		{
			return  false;
		}
		$db = $this->getAdapter();
		
		$select = $db->select()->from('projects_products')->where('project_id =?',$project_id)->order('sort_id asc')->where('status = 1')
			->join('P21_Inv_Mast', 'projects_products.product_id = P21_Inv_Mast.item_id','item_desc');
		
		return Zend_Json::encode($db->fetchAll($select));
	}
	
	public function fetchallitemsbyprojectid($project_id)
	{
		if($project_id == null)
		{
			return  false;
		}
		$db = $this->getAdapter();
		
		$select = $db->select()->from('projects_products')->join('quote','quote.project_id = projects_products.project_id',null)->where('project_id =?',$project_id)->order('sort_id asc')->where('projects_products.status = 1')
		->join('P21_Inv_Mast', 'projects_products.product_id = P21_Inv_Mast.item_id','item_desc')->order('sort_id asc');
		
		return $db->fetchAll($select);
	}
	
}

