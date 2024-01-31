<?php

namespace Centura\Model;

use Zend_Db_Table;

class QuotePrivilege extends Zend_Db_Table
{
    
	public function save($data)
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

