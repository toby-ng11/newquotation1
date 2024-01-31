<?php

namespace Centura\Model;

use Centura\Model\DbTable_Item;

class Item extends DbTable_Item
{
    
	public function fetchItembyid($item_id,$company=DEFAULT_COMPNAY_ID)
	{
	    if($item_id == null)
	    {
	        return false;
	    }
	    $db = $this->getAdapter();
	    $select = $db->select()->from('P21_Quote_Item')->where('item_id = ?',$item_id)->where('location_id =?',$company);
	    
	    return $db->fetchRow($select);
	}
	
	public function fetchallItems($limit,$offset = 0,$company = DEFAULT_COMPNAY_ID)
	{
	    $db = $this->getAdapter();
	    $select = $db->select()->from('P21_Quote_Item')->where('location_id =?',101);
	    if($limit != null)
	    {
	        $select->limit($limit,$offset);
	    }

		return $db->fetchAll($select);
	}
	
	public function fetchItemByPatten($patten,$limit=20, $company = DEFAULT_COMPNAY_ID)
	{
	    $db = $this->getAdapter();
	    $select = $db->select()->from('P21_Quote_Item',array('item_id','item_desc'))->where('location_id =?',$company)
	    	->where('item_id LIKE ?', $patten.'%')->order('item_id asc');
	    $select->limit($limit);
	    
	    return $db->fetchAll($select);
	}
	
	public function fetchUomByItemId($item_id, $company = DEFAULT_COMPNAY_ID)
	{
	    if($item_id == null)
	    {
	        return null;
	    }
	    $db = $this->getAdapter();
	    $select = $db->select()->distinct()->from('P21_Item_UOM_Price_Conversion',array('uom'=>'unit_of_measure'))->where('item_id = ?',$item_id)->where('location_id =?',$company);

	    return $db->fetchAll($select);
	}
	
	public function fetchItemPrice($item_id,$uom,$company = DEFAULT_COMPNAY_ID)
	{
	    if($item_id == null || $uom==null)
	    {
	    	return null;
	    }
	    $db = $this->getAdapter();
	    $select = $db->select()->distinct()->from('P21_Item_UOM_Price_Conversion',array('price'=>'Price_Conversion'))->where('unit_of_measure = ?',$uom)
	    		->where('item_id = ?',$item_id)->where('location_id =?',$company);
		$result = $db->fetchRow($select);
		$result['price'] = round($result['price'],2);
	    return $result;
	}
	
}

