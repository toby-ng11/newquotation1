<?php

namespace Centura\Model;

use Zend_Db_Table;
use Zend_Registry;
use Zend_db_Expr;

use Exception;
use Zend_Json;

class ProjectNote extends Zend_Db_Table
{

	public function add($project_id, $data)
	{
		if ($project_id == null || $data == null) {
			return  false;
		}

		$db = $this->getAdapter();

		$info['project_id']   = $project_id;
		$info['note_title']   = trim($data['note_title']);
		$info['project_note'] = trim($data['project_note']);
		$info['next_action']  = trim($data['next_action']);
		$info['date_added']   = new Zend_Db_Expr('GETDATE()');
		$info['owner_id']     = $data['owner_id'];
		$info['delete_flag']  = 'N';

		try {
			$db->insert('project_note', $info);
		} catch (Exception $e) {
			error_log($e->getMessage());
			return false;
		}
		return true;
	}

	public function edit($memo_id, $data)
	{
		if ($memo_id == null) {
			return  false;
		}

		$db = $this->getAdapter();

		$info['note_title']   = trim($data['note_title']);
		$info['project_note'] = trim($data['project_note']);
		$info['next_action']  = trim($data['next_action']);
		//$info['date_added']   = date('Y-m-d H:i:s', strtotime($data['date_added']));

		try {
			$db->update('project_note', $info, 'project_note_id =' . $memo_id);
		} catch (Exception $e) {
			error_log($e->getMessage());
			return false;
		}
		return true;
	}

	public function remove($momo_id)
	{
		if ($momo_id == null) {
			return  false;
		}

		$db = $this->getAdapter();

		$data['delete_flag'] = 'Y';

		try {
			$db->update('project_note', $data, 'project_note_id = ' . $momo_id);
		} catch (Exception $e) {
			error_log($e->getMessage());
			return false;
		}
		return true;
	}

	public function fetchProjectNote($project_id, $Json = false)
	{
		if ($project_id == null) {
			return  false;
		}
		$db = $this->getAdapter();

		$select = $db->select()
			->from('p2q_view_project_note')
			->where('project_id =?', $project_id);

		$result = $db->fetchAll($select);

		if ($Json) {
			return Zend_Json::encode($result);
		} else {
			return $result;
		}
	}

	public function fetchmemobyowner($owner = null, $Json = false)
	{
		if ($owner == null) {
			$session =  Zend_Registry::get('session');
			$owner = $session->user['id'];
		}
		$db = $this->getAdapter();

		$select = $db->select()
			->from('p2q_view_project_note')
			->where('owner_id = ?', $owner)
			->orWhere('shared_id = ?', $owner)
			->order('project_note_id desc');

		$result = $db->fetchAll($select);

		if ($Json) {
			return Zend_Json::encode($result);
		} else {
			return $result;
		}
	}
}
