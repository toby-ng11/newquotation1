<?php

use Centura\Model\ProjectNote;

//use Zend_Controller_Action;

class NoteController extends Zend_Controller_Action
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

			$memo = new ProjectNote();

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
		$memo = new ProjectNote();
		$memo->edit($memoId, $data);
		exit;
	}

	public function deleteAction()
	{
		$id = $this->getRequest()->getParam('id');
		$memo = new ProjectNote();

		$memo->remove($id);

		exit;
	}
}
