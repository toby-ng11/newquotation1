<?php

namespace Centura\Model;

use Centura\Model\{Specifier};

use Zend_Registry;
use Zend_Json;

use Exception;

use DateTime;

use SSP;
use Zend_Db;
use Zend_Db_Expr;

require_once('ssp.class.php');
class Project extends DbTable\Project
{

	public function save($data)
	{
		if ($data == null) {
			return  false;
		}
		$db = $this->getAdapter();

		$info['delete_flag'] = 'N';
		$info['project_name'] = trim($data['project_name']);
		$info['project_address'] = trim($data['project_address']);
		$info['centura_location_id'] = $data['location_id'];
		$info['market_segment_id']      = $data['market_segment_id'];
		$info['owner_id']               = $data['owner_id'];
		$info['last_maintained_by']     = $data['owner_id'];
		$info['shared_id'] = $data['shared_id'];
		$info['reed']                     = $data['reed'];
		$info['status']                     = $data['status'];

		if ($data['general_contractor_id'] != '') {
			$info['general_contractor_id'] = $data['general_contractor_id'];
		}

		if ($data['awarded_contractor_id'] != '') {
			$info['awarded_contractor_id'] = $data['awarded_contractor_id'];
		}

		$info['create_date']                = new Zend_Db_Expr('GETDATE()');

		if (!empty($data['require_date'])) {
			$info['require_date']              = $data['require_date'];
		} else {
			$info['require_date']              = new Zend_Db_Expr('GETDATE()');
		}

		if (!empty($data['due_date'])) {
			$info['due_date']                   = $data['due_date'];
		} else {
			$info['due_date']                   = new Zend_Db_Expr('GETDATE()');
		}

		if (empty($data['specifier_id'])) // if specifier id is empty add new
		{
			$specifier = new Specifier();
			$info['specifier_id'] = $specifier->addspec($data['specifier_name'], $data['specifier_location'], $data['owner_id']);
		} else {
			$info['specifier_id'] = $data['specifier_id'];
		}

		if (empty($data['architect_id'])) // if specifier id is empty add new
		{
			$architect = new Specifier();
			$info['architect_id'] = $architect->addspec($data['architect_name'], $data['architect_location'], $data['owner_id']);
		} else {
			$info['architect_id'] = $data['architect_id'];
		}

		try {
			$db->insert('project', $info);
		} catch (Exception $e) {
			print_r($e);
			return  false;
		}

		$newProjectID = $db->lastInsertId('project', 'project_id');
		$result = $this->fetchbyid($newProjectID);
		if ($newProjectID != null) // update
		{
			$data = null;
			$data['project_id_ext'] = DEFAULT_COMPNAY . '_' . $newProjectID;
			if ($result['project_name'] == null) // no name 
			{
				$data['project_name'] = DEFAULT_COMPNAY . '_' . $newProjectID;
			}
			$this->updateproject($newProjectID, $data);
		}
		//$this->log($newProjectID, 'Project Create', null, null, serialize($info));
		return $newProjectID;
	}

	public function updateproject($project_id, $data)
	{
		if ($project_id == null) {
			return false;
		} else {
			$db = $this->getAdapter();
			try {
				$db->update('project', $data, 'project_id =' . $project_id);
			} catch (Exception $e) {
				var_dump($e);
			}
		}
	}

	public function fetchlatest($owner = null)
	{
		$db = $this->getAdapter();
		$select = $db->select()
			->from('project')
			->order('project_id desc');
		if ($owner != null) {
			$select->where('owner = ?', $owner);
		}
		return $db->fetchRow($select);
	}

	public function fetchbyowner($owner = null, $count = 5, $offset = 0)
	{
		if ($owner == null) {
			return  false;
		}
		$db = $this->getAdapter();
		$db = $this->getAdapter();
		$select = $db->select()
			->from('p2q_view_project')
			->where('owner_id = ?', $owner)
			->order('project_id desc');

		return $db->fetchAll($select);
	}

	public function fetchbyownerJson($owner = null, $count = 5, $offset = 0)
	{
		if ($owner == null) {
			return  false;
		}
		$db = $this->getAdapter();
		$select = $db->select()
			->from('p2q_view_project')
			->where('owner_id = ?', $owner)
			->order('project_id desc');

		return Zend_Json::encode($db->fetchAll($select));
	}

	public function fetchbyassign($owner = null, $count = 5, $offset = 0)
	{
		if ($owner == null) {
			return  false;
		}
		$db = $this->getAdapter();
		$select = $db->select()
			->from('p2q_view_project')
			->where('shared_id = ?', $owner)
			->order('project_id desc');

		return $db->fetchAll($select);
	}

	public function fetchbyassignJson($owner = null, $count = 5, $offset = 0)
	{
		if ($owner == null) {
			return  false;
		}
		$db = $this->getAdapter();
		$select = $db->select()
			->from('p2q_view_project')
			->where('shared_id = ?', $owner)
			->order('project_id desc');

		return Zend_Json::encode($db->fetchAll($select));
	}

	public function fetchothers($owner = null, $company_id = DEFAULT_COMPNAY_ID)
	{
		if ($owner == null) {
			return  false;
		}
		$db = $this->getAdapter();
		$select = $db->select()
			->from('p2q_view_project')
			->where('owner_id != ?', $owner)
			->order('project_id desc');

		return $db->fetchAll($select);
	}

	public function fetchothersJson($owner = null, $company_id = DEFAULT_COMPNAY_ID)
	{
		if ($owner == null) {
			return  false;
		}
		$db = $this->getAdapter();
		$select = $db->select()
			->from('p2q_view_project')
			->where('owner_id != ?', $owner)
			->order('project_id desc');


		return Zend_Json::encode($db->fetchAll($select));
	}

	public function fetchallproject($owner = null)
	{
		$db = $this->getAdapter();
		$select = $db->select()->from('project')->order('project_id desc')->join('P21_Location_x_Branch', 'centura_location_id = P21_Location_x_Branch.location_id', 'company_id')
			->join('quote_status', 'quote_status.uid=project.status', array('status_name' => 'Status'))
			->join('quote_market_segment', 'quote_market_segment.uid = project.market_segment', array('segment' => 'Market_Segment'))->where('project.delete_flag =?', 'N')
			->join('quote_specifier', 'quote_specifier.uid = project.specifier', array('Specifier_name' => 'quote_specifier.Specifier'));

		if ($owner != null) {
			$select->where('owner = ?', $owner);
		}
		return $db->fetchAll($select);
	}

	public function fetchallprojectJson($owner = null)
	{
		$db = $this->getAdapter();
		$select = $db->select()->from('view_project');

		return Zend_Json::encode($db->fetchAll($select));
	}

	public function getAdminProjects()
	{
		$dbDetails = $this->getAdapter();

		$table = "p2q_view_project";

		$primaryKey = 'project_id';

		$columns = array(
			array('db' => 'project_id',       	 'dt' => 'project_id'),
			array('db' => 'project_id_ext',   	 'dt' => 'project_id_ext'),
			array('db' => 'project_name',     	 'dt' => 'project_name'),
			array('db' => 'owner_id',         	 'dt' => 'owner_id'),
			array('db' => 'shared_id', 		  	 'dt' => 'shared_id'),
			array('db' => 'create_date',      	 'dt' => 'create_date'),
			array('db' => 'due_date',         	 'dt' => 'due_date'),
			array('db' => 'specifier_name',   	 'dt' => 'specifier_name'),
			array('db' => 'market_segment_desc', 'dt' => 'market_segment_desc'),
			array('db' => 'status',           	 'dt' => 'status')
		);

		echo Zend_Json::encode(
			SSP::simple($_POST, $dbDetails, $table, $primaryKey, $columns)
		);
	}

	public function fetchbyid($project_id = null)
	{
		if ($project_id == null) {
			return false;
		}

		$db = $this->getAdapter();
		$select = $db->select()->from('p2q_view_project')
			->where('project_id = ?', $project_id);
		$result = $db->fetchRow($select);
		return $result;
	}

	public function edit($data, $project_id)
	{
		if ($data == null || $project_id == null) {
			return  false;
		}
		$db = $this->getAdapter();

		$info['market_segment']      = $data['market_segment'];
		$info['centura_location_id'] = $data['location'];
		$info['owner']               = $data['owner'];
		$info['project_location_address'] = $data['project_location_address'];
		$info['reed']                     = $data['reed'];
		$info['general_contractor_id']    = $data['gerneral_contractor_id'];
		$info['awarded_sub_contracotr_id']  = $data['awarded_contractor_id'];
		//$info['create_date']                = date('Y-m-d H:i:s');
		$info['required_date']              = DateTime::createFromFormat('Y-m-d', $data['required_date'])->format('Y-m-d');
		$info['due_date']                   = DateTime::createFromFormat('Y-m-d', $data['due_date'])->format('Y-m-d');
		$info['status']                     = $data['status'];
		$info['architect']                  = $data['architect'];
		$info['specifier']                 = $data['specifier'];
		$info['delete_flag']                     = 'N';
		$info['quote_no']                   = $data['quote_no'];
		$info['project_name']                = $data['project_name'];
		$info['worksheet_assign']           = $data['worksheet_assign'];

		if ($info['architect'] == null || $info['architect'] == 0 || strtolower($this->fetchspecbyid($info['architect'])) != strtolower($data['architect_name'])) // no id or not match
		{

			$info['architect'] = $this->addspec($data['architect_name']);
		} else {
			if (strtolower($this->fetchspecbyid($info['architect'])) == strtolower($data['architect_name'])) // same name already exitst
			{

				$result = $this->fetchspec($info['architect']);
				$info['architect'] = $result['uid'];
			}
		}

		if ($info['specifier'] == null || $info['specifier'] == 0  || strtolower($this->fetchspecbyid($info['specifier'])) != strtolower($data['specifier_name'])) // no id
		{
			$info['specifier'] = $this->addspec($data['specifier_name']);
		} else {
			if (strtolower($this->fetchspecbyid($info['specifier'])) == strtolower($data['specifier_name'])) // same name already exitst
			{

				$result = $this->fetchspec($data['specifier']);
				$info['specifier'] = $result['uid'];
			}
		}

		try {
			$db->update('project', $info, 'project_id =' . $project_id);
		} catch (Exception $e) {
			error_log($e->getMessage());
			return  false;
		}

		$this->log($project_id, 'Project Update', null, null, json_encode($info));

		return true;
	}

	public function remove($project_id)
	{
		if ($project_id == null) {
			return  false;
		}
		$db = $this->getAdapter();

		//$data['status'] = 13;  //legacy
		$data['delete_flag'] = 'Y';

		try {
			$db->update('project', $data, 'project_id =' . $project_id);
		} catch (Exception $e) {
			var_dump($e);
			return  false;
		}
		$this->log($project_id, 'Project Delete');
		return true;
	}

	public function log($project_id, $action = 'default', $quote_id = null, $item_id = null, $note = null)
	{
		if ($project_id == null) {
			return false;
		}
		$session =  Zend_Registry::get('session');
		$db = $this->getAdapter();

		$data['project_id'] = $project_id;
		$data['quote_id']  = $quote_id;
		$data['action']    = $action;
		$data['item_id']   = $item_id;
		$data['note']      = $note;
		$data['added']     = date('Y-m-d H:i:s');
		$data['user_id']   = $session->user['id'];

		try {
			$db->insert('project_log', $data);
		} catch (Exception $e) {
			var_dump($e);
			exit;
			return  false;
		}

		return true;
	}

	public function fetchlogbyid($project_id)
	{
		if ($project_id == null) {
			return false;
		}
		$db = $this->getAdapter();

		$select = $db->select()->from('project_log')->join('project', 'project.project_id = project_log.project_id', array('address' => 'project_location_address', 'project_name'))
			->where('project_log.project_id = ?', $project_id)->order('added desc');

		return $db->fetchAll($select);
	}

	public function fetchlogbyowner($owner)
	{
		if ($owner == null) {
			$session =  Zend_Registry::get('session');
			$owner = $session->user['id'];
		}
		$db = $this->getAdapter();

		$select = $db->select()->from('project_log')->join('project', 'project.project_id = project_log.project_id', array('address' => 'project_location_address', 'project_name'))
			->where('project.owner = ?', $owner)->order('added desc');
		return $db->fetchAll($select);
	}

	public function fetchProjectStatus()
	{
		$db = $this->getAdapter();
		$select = $db->select()
			->from('status')
			->where('delete_flag = ?', 'N')
			->where('project_flag = ?', 'Y')
			->order('status_desc asc');

		return $db->fetchAll($select);
	}

	public function fetchProjectSegment()
	{
		$db = $this->getAdapter();
		$select = $db->select()
			->from('market_segment')
			->where('delete_flag = ?', 'N')
			->order('market_segment_desc asc');

		return $db->fetchAll($select);
	}
}
