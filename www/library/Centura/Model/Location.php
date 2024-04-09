<?php

namespace Centura\Model;

use Zend_Db_Table;

class Location extends Zend_Db_Table
{
	function fetchAllBranches()
	{
		$db = $this->getAdapter();
		$select = $db->select()->from('P21_Location', array('location_id', 'company_id'))
			->join('P21_Branch', 'P21_Branch.branch_id = P21_Location.default_branch_id', array('name' => 'branch_description'))
			->where('P21_Location.delete_flag = ?', 'N')
			->order('branch_description desc');

		return $db->fetchAll($select);
	}

	function fetchBranchesByCompanyId($company_id)
	{
		$db = $this->getAdapter();
		$select = $db->select()->from('P21_Location', array('location_id', 'company_id'))
			->join('P21_Branch', 'P21_Branch.branch_id = P21_Location.default_branch_id', array('name' => 'branch_description'))
			->where('P21_Location.company_id = ?', $company_id)
			->where('P21_Location.delete_flag = ?', 'N')
			->order('branch_description desc');

		return $db->fetchAll($select);
	}
}
