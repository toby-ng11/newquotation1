<?php

class Centura_Model_Product extends Centura_Model_DbTable_Products
{
    
	public function add($data)
	{
	    if($data == null)
	    {
	        return  false;
	    }
	    $db = $this->getAdapter();
	    
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
		
		
	}
	
}

