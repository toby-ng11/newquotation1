<?php

namespace Centura\Model;

use Zend_Registry;
use Zend_Json;
use Exception;

class Specifier extends DbTable\Specifier {

    public function addspec($name, $location, $owner_id) {
		if ($name == null) {
			return false;
		}

		$db = $this->getAdapter();

		$info['specifier_name'] = $name;
        $info['date_added']     = date('Y-m-d H:i:s');
        $info['added_by']       = $owner_id;
		$info['delete_flag']    = 'N';
		$info['location_id']     = $location;

		try {
			$db->insert('specifier', $info);
		} catch (Exception $e) {
			error_log(print_r($e));
			return false;
		}

		$newSpecifierID = $db->lastInsertId('specifier', 'specifier_id');

		return $newSpecifierID; //return the new specifier id to add in project
	}

	public function fetchspecbyid($uid)
	{
		if ($uid == null) {
			return false;
		}
		$db = $this->getAdapter();

		$select = $db->select()
			->from('p2q_view_specifier')
			->where('specifier_id = ?', $uid);

		$result = $db->fetchRow($select);

		return $result;
	}

	public function fetchspecbyname($patten, $company = DEFAULT_COMPNAY, $limit = 20)
	{
		$db = $this->getAdapter();

		$select = $db->select()
			->from('p2q_view_specifier', array('specifier_id', 'specifier_name', 'location_id', 'branch_description'))
			->where('company_id = ?', $company)
			->where('specifier_name LIKE ?', '%' . $patten . '%')
			->limit($limit);

		return $db->fetchAll($select);
	}
}