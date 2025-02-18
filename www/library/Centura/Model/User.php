<?php

namespace Centura\Model;

class User extends DbTable\User
{

	private $sales_group = array(1, 2);

	public function fetchuser($username, $company = DEFAULT_COMPNAY_ID)
	{
		if ($username == null) {
			return  false;
		}
		$db = $this->getAdapter();
		$select = $db->select()
			->from("P21_Users", array(
				'id',
				'first_name',
				'last_name',
				'name',
				'company' => 'default_company',
				'default_branch',
				'role_uid',
				'role',
				'email' => 'email_address'
			))
			//->where('P21_Users.delete_flag = ?', 'N') moved to SQL server
			//->join('P21_Roles', 'P21_Roles.role_uid = P21_Users.role_uid', array('role'))
			//->join('P21_Location_x_Branch', 'P21_Location_x_Branch.company_id = P21_Users.default_company', 'location_id')
			->where('P21_Users.id = ?', $username);
	
		$user = $db->fetchRow($select);

		$user['sale_role'] = 'guest';

		if (
			strpos($user['role'], 'Sales') !== false
			|| strpos($user['role'], 'VAN - Order Desk') !== false
			|| strpos($user['role'], 'CAL - Purchasing') !== false
		) {
			$user['sale_role'] = 'sales';
		}

		if (
			strpos($user['role'], 'Sales Management') !== false || strpos($user['role'], 'Sales Admin') !== false
			|| strpos($user['role'], 'VAN - Operation Manager') !== false
			|| strpos($user['role'], 'VAN - Accounts Receivable') !== false
			|| strpos($user['role'], 'EDM - Sales') !== false
		) {
			$user['sale_role'] = 'manager';
		}

		if (strpos($user['role'], 'IT') !== false) {
			$user['sale_role'] = 'admin';
		}

		/* exceptional check roger provided list */
		if ($this->exceptionalUserRoleManager($user['id'])) {
			$user['sale_role'] = 'manager';
		}

		if ($user['sale_role'] = 'manager' || $user['sale_role'] = 'admin') {
			$user['approve_id'] = $user['role_uid'];
		} else {
			$user['approve_id'] = null;
			
		}

		return $user;
	}

	public function exceptionalUserRoleManager($id)
	{
		$exceptionalUserList = array(
			'VHITCHEN',
			//'TNGUYEN'
		);


		if (in_array($id, $exceptionalUserList)) {
			return true;
		} else {
			return false;
		}
	}


	public function fetchallsales($company = DEFAULT_COMPNAY)
	{
		$db = $this->getAdapter();
		$select = $db->select()
			->distinct()
			->from("P21_Users", array('id', 'name', 'default_company'))
			->where('default_company = ?', $company)
			->where("role LIKE '%Sales%' OR role LIKE '%Manager%' OR role LIKE '%Accounts Receivable%'")
			;
			

		//if ($company != null) {
		//	$select->where('P21_Location_x_Branch.location_id = ?', $company);
		//}
		return $db->fetchAll($select);
	}

	public function fetchallmangers($company = DEFAULT_COMPNAY_ID)
	{

		$db = $this->getAdapter();
		$select = $db->select()->from("P21_Users", array('id', 'name', 'default_company', 'role_uid', 'email' => 'email_address'))->where('P21_Users.delete_flag = ?', 'N')
			->join('P21_Roles', 'P21_Roles.role_uid = P21_Users.role_uid', array('role'))
			->join('P21_Location_x_Branch', 'P21_Location_x_Branch.company_id = P21_Users.default_company', 'location_id')
			->where('role LIKE ? ', '%Sales Management%')->orWhere('role LIKE ?', '%Sales Administration%')
			->orWhere('role LIKE ?', '%Operation Manager%')->orWhere('role LIKE ?', '%Accounts Receivable%');
		if ($company != null) {
			$select->where('P21_Location_x_Branch.location_id = ?', $company);
		}
		return $db->fetchAll($select);
	}

	public function get_role($username, $company = DEFAULT_COMPNAY_ID)
	{
		$db = $this->getAdapter();
		$select = $db->select()->from("P21_Users", array('id', 'name', 'default_company', 'role_uid', 'email' => 'email_address'))->where('P21_Users.delete_flag = ?', 'N')
			->join('P21_Roles', 'P21_Roles.role_uid = P21_Users.role_uid', array('role'))
			->join('P21_Location_x_Branch', 'P21_Location_x_Branch.company_id = P21_Users.default_company', 'location_id')->where('P21_Users.id = ?', $username);
		if ($company != null) {
			$select->where('P21_Location_x_Branch.location_id = ?', $company);
		}
		$user = $db->fetchRow($select);
		return $user;
	}

	public function getQuoteapproval($company = DEFAULT_COMPNAY)
	{
		if ($company == null) {
			$company = 'TOR';
		}
		$db = $this->getAdapter();
		$select = $db->select()->from('quote_approval')->where('Company_ID = ?', $company)->where('DeleteFlag = ?', 'N');

		return $db->fetchAll($select);
	}

	public function fetchallsalesbyloc($company = DEFAULT_COMPNAY)
	{
		$db = $this->getAdapter();
		$select = $db->select()->distinct()->from("P21_Users", array('id', 'name', 'default_company'))->where('P21_Users.delete_flag = ?', 'N')
			->join('P21_Roles', 'P21_Roles.role_uid = P21_Users.role_uid', null)->join('P21_Roles', 'P21_Roles.role_uid = P21_Users.role_uid', null)
			->join('P21_Location_x_Branch', 'P21_Location_x_Branch.company_id = P21_Users.default_company', null)
			->where('P21_Roles.role LIKE ? ', '%Sales%');
		if ($company != null) {
			$select->where('P21_Location_x_Branch.company_id = ?', $company);
		}
		return $db->fetchAll($select);
	}

	public function fetchsalebyid($id)
	{
		if ($id == null) {
			return false;
		}
		$db = $this->getAdapter();
		$select = $db->select()
		->distinct()
		->from("P21_Users")
		->where('id = ?', $id);
		return $db->fetchRow($select);
	}

	public function fetchlocationid($company_id)
	{
		if ($company_id == null) {
			return false;
		}
		$db = $this->getAdapter();
		$select = $db->select()->from("P21_Location_x_Branch", array('location_id'))->where('company_id = ?', $company_id);
		return $db->fetchRow($select);
	}

	public function fetchUserIdByPattern($pattern, $limit = 10) {
		$db = $this->getAdapter();

		$select = $db->select()
			->from("P21_Users", array('id', 'name'))
			->where('id LIKE ?', $pattern.'%')
			->orWhere('name LIKE ?', $pattern.'%')
			->limit($limit);

		return $db->fetchAll($select);
	}
}
