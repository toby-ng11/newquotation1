<?php

namespace Centura\Model;

use Zend_Db_Table;

class Location extends Zend_Db_Table
{
	function fetchAllBranches()
	{
		$db = $this->getAdapter();
		$select = $db->select()
			->from('P21_Location_x_Branch')
			->order('location_id asc');

		return $db->fetchAll($select);
	}

	function fetCompanyId() {
		$unusedCompanyId =  array('M98', 'LTD', 'H97');
		$db = $this->getAdapter();
		$select = $db->select()
			->distinct()
			->from('P21_Location_x_Branch', 'company_id')
			->where('company_id not in (?)', $unusedCompanyId);
		return $db->fetchAll($select);
	}
}
