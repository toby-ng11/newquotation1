<?php

use Centura\Model\ProjectMemo;

//use Zend_Controller_Action;

class MemoController extends Zend_Controller_Action
{

	public function init()
	{
	}

	public function indexAction()
	{
	}

	public function addAction()
	{
		$project_id = $this->getRequest()->getParam('pro');

		if ($this->_request->isXmlHttpRequest() && $this->_request->isPost() && $project_id != null) {
			$data = $this->_request->getPost();

			$memo = new ProjectMemo();

			echo $memo->add($project_id, $data);
		} else {
			echo '0';
		}

		exit;
	}

	public function editAction()
	{
		$memoId = $this->getRequest()->getParam('id');
		$data = $this->_request->getPost();
		$memo = new ProjectMemo();
		$memo->edit($memoId, $data);
		exit;
	}

	public function deleteAction()
	{
		$id = $this->getRequest()->getParam('id');
		$memo = new ProjectMemo();

		$memo->remove($id);

		exit;
	}
}
