<?php

namespace Centura\Model;

use Zend_Db_Table;
use Zend_Registry;

use Exception;
use Zend_Json;

class ProjectMemo extends Zend_Db_Table
{

	public function add($project_id, $data)
	{
		if ($project_id == null || $data == null) {
			return  false;
		}

		$db = $this->getAdapter();

		$info['type'] = $data['type'];
		$info['project_id'] = $project_id;
		$info['title'] = trim($data['title']);
		$info['content'] = trim($data['content']);
		$info['follow_up_date'] = date('Y-m-d H:i:s', strtotime($data['follow_up_date']));
		$info['author'] = $data['author'];

		try {
			$db->insert('project_memo', $info);
		} catch (Exception $e) {
			echo error_log($e->getMessage());
			return false;
		}
		return $this->fetchlatest($project_id);
	}

	public function edit($memo_id, $data)
	{
		if ($memo_id == null) {
			return  false;
		}

		$db = $this->getAdapter();

		$info['type'] = $data['type'];
		$info['title'] = trim($data['title']);
		$info['content'] = trim($data['content']);
		$info['follow_up_date'] = date('Y-m-d H:i:s', strtotime($data['follow_up_date']));

		try {
			$db->update('project_memo', $info, 'memo_id =' . $memo_id);
		} catch (Exception $e) {
			echo error_log($e->getMessage());
			return false;
		}
		return true;
	}

	public function fetchlatest($project_id)
	{
		$db = $this->getAdapter();
		$select = $db->select()->from('project_memo')->where('project_id =?', $project_id)->order('added desc');

		$result = $db->fetchRow($select);

		return $result['memo_id'];
	}

	public function remove($momo_id)
	{
		if ($momo_id == null) {
			return  false;
		}

		$db = $this->getAdapter();

		$data['Delete_Flag'] = 'Y';

		try {
			$db->update('project_memo', $data, 'memo_id = ' . $momo_id);
		} catch (Exception $e) {
			return false;
		}
		return true;
	}

	public function fetchmemosbyproject($project_id)
	{
		if ($project_id == null) {
			return  false;
		}
		$db = $this->getAdapter();

		$select = $db->select()->from('project_memo')->where('project_id =?', $project_id)->where('project_memo.Delete_Flag = ?', 'N');

		return $db->fetchAll($select);
	}

	public function fetchmemosbyprojectJson($project_id)
	{
		if ($project_id == null) {
			return  false;
		}
		$db = $this->getAdapter();

		$select = $db->select()->from('project_memo')
			->where('project_id =?', $project_id)
			->where('project_memo.Delete_Flag = ?', 'N');

		return Zend_Json::encode($db->fetchAll($select));
	}

	public function fetchalltypes()
	{
		$db = $this->getAdapter();

		$select = $db->select()->from('project_memo_types')
			->where('Delete_Flag = ?', 'N');
		return $db->fetchAll($select);
	}


	public function fetchmemobyowner($owner = null)
	{
		if ($owner == null) {
			$session =  Zend_Registry::get('session');
			$owner = $session->user['id'];
		}
		$db = $this->getAdapter();

		$select = $db->select()->from('project_memo')
			->join('project', 'project.project_id = project_memo.project_id', array('address' => 'project_location_address', 'project_name'))
			->where('project.owner = ?', $owner)
			->orWhere('project.worksheet_assign = ?', $owner)
			->order('added desc');
		return $db->fetchAll($select);
	}

	public function fetchmemobyownerJson($owner = null)
	{
		if ($owner == null) {
			$session =  Zend_Registry::get('session');
			$owner = $session->user['id'];
		}
		$db = $this->getAdapter();

		$select = $db->select()->from('project_memo')
			->join('project', 'project.project_id = project_memo.project_id', array('address' => 'project_location_address', 'project_name'))
			->where('project.owner = ?', $owner)
			->orWhere('project.worksheet_assign = ?', $owner)
			->order('added desc');
		$result = $db->fetchAll($select);
		return Zend_Json::encode($result);
	}
}
