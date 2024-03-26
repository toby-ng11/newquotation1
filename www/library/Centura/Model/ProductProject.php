<?php

namespace Centura\Model;

use Zend_Json;

class ProductProject extends DbTable\Products
{
    
	public function add($data,$quote_id)
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
	    		$i['sort_id'] = $sort;
	    		$i['note'] = $item['note'][$k];
	    		$i['unit_price'] = $item['unit_price'][$k];
	    		$i['note'] = $item['note'][$k];
	    		$i['uom'] =$item['uom'][$k];
	    		$i['subtotal'] = $item['total_price'][$k];
	    		$sort++;
	    		$db->insert('quotes_products', $i);
	    		$i = null;
	    	}	
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
				$db->insert('quotes_products', $i);
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
	
	public function remove($quote_id)
	{
		if($quote_id == null)
		{
			return  false;
		}
		$db = $this->getAdapter();
		$data['status'] = 0 ;
		
		$db->update('quotes_products', $data,'quote_id ='.$quote_id);
		
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
		
		$select = $db->select()->from('quotes_products')->where('quote_id =?',$quote_id)->order('sort_id asc')->where('status = 1')
			->join('P21_Inv_Mast', 'quotes_products.product_id = P21_Inv_Mast.item_id','item_desc');
		
		return $db->fetchAll($select);
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
	
		$select = $db->select()->from('quotes_products')->where('quote_id =?',$quote_id)->order('sort_id asc')->where('status = 1')
		//->join('P21_Inv_Mast', 'quotes_products.product_id = P21_Inv_Mast.item_id','item_desc')
		->join('P21_Item_UOM_Price_Conversion', 'quotes_products.product_id = P21_Item_UOM_Price_Conversion.item_id and quotes_products.uom = P21_Item_UOM_Price_Conversion.unit_of_measure',
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
		
		$select = $db->select()->from('quotes_products')->join('quote','quote.quote_id = quotes_products.quote_id',null)->where('project_id =?',$project_id)->order('sort_id asc')->where('quotes_products.status = 1')
		->join('P21_Inv_Mast', 'quotes_products.product_id = P21_Inv_Mast.item_id','item_desc');
		
		return $db->fetchAll($select);
	}

	public function fetchallitemsbyprojectidJson($project_id)
	{
		if($project_id == null)
		{
			return  false;
		}
		$db = $this->getAdapter();
		
		$select = $db->select()->from('quotes_products')->join('quote','quote.quote_id = quotes_products.quote_id',null)->where('project_id =?',$project_id)->order('sort_id asc')->where('quotes_products.status = 1')
		->join('P21_Inv_Mast', 'quotes_products.product_id = P21_Inv_Mast.item_id','item_desc');
		
		return Zend_Json::encode($db->fetchAll($select));
	}
	
}

