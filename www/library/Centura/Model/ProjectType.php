<?php

class Centura_Model_ProjectType extends Zend_Db_Table
{
    function fetchAllTypes()
    {
    	$db = $this->getAdapter();
    	$select = $db->select()->from('project_type',array('Type_value','Type_description'))
    	->where('project_type.delete_flag = ?','N')->order('uid asc');
    	
    	return $db->fetchAll($select);
    }
     
}

