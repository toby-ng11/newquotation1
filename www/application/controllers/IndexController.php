<?php

use Centura\Model\{ 
	Project,
	Quote,
	ProjectNote,
	Location
};

class IndexController extends Zend_Controller_Action
{

	public function init()
	{
		/* Initialize action controller here */
		$this->session =  Zend_Registry::get('session');
		if (APPLICATION_ENV == 'production') {
			$this->sale_id = $this->session->user['id'];
		} else {
			$this->sale_id = 'TORTESTSALESMGR001';
		}
	}

	public function indexAction()
	{
		$this->view->headTitle()->set('P2Q - Project Portal');

		if ($this->session->user['sale_role'] == 'admin' && APPLICATION_ENV == 'production' && $this->_getParam('normal') == null) {
			$this->redirect('/index/admin');
		}
		//if ($this->session->user['approve_id'] != null && APPLICATION_ENV == 'production' && $this->_getParam('normal') == null) {
		//	$this->redirect('/index/approval');
		//}

		$project = new Project();
		$quote = new Quote();
		$memo = new ProjectNote();

		$this->view->ownproject = $project->fetchbyowner($this->sale_id);
		$this->view->assignedproject = $project->fetchbyassign($this->sale_id);
		$this->view->ownquotes = $quote->fetchrelated($this->sale_id);

		$this->view->memo = $memo->fetchmemobyowner($this->sale_id, false);

		if ($this->session->user['approve_id'] != null) {
			$this->view->otherprojects = $project->fetchothers($this->sale_id, DEFAULT_COMPNAY);
		}
	}

	public function adminAction()
	{
		$this->view->headTitle()->set('P2Q - Admin Portal');

		if ($this->session->user['sale_role'] != 'admin' && APPLICATION_ENV == 'production') {
			$this->redirect('/index/');
		}

		$quote = new Quote();
		$project = new Project();
		$location = new Location();

		//$this->view->ownproject = $quote->fetchtotal(); //legacy
		//$this->view->projects = $project->fetchallproject(); //legacy
		$this->view->companyId = $location->fetCompanyId();
	}

	public function approvalAction()
	{
		if ($this->session->user['approve_id'] == null && APPLICATION_ENV == 'production') {
			$this->redirect('/index');
		}

		$this->view->headTitle()->set('P2Q - Approval Portal');

		$quote = new Quote();
		$project = new Project();

		if ($this->session->user['sale_role'] == 'admin') {
			$is_admin = true;
		} else {
			$is_admin = false;
		}
		$this->view->waiting = $quote->fetchwaiting(1, $is_admin);
		$this->view->approved = $quote->fetchwaiting(10, $is_admin);
		$this->view->disapproved = $quote->fetchwaiting(-1, $is_admin);
	}

	public function projectsalesrepAction() // ajax
	{
		$project = new Project();
		echo $project->fetchbyownerJson($this->sale_id);
		exit;
	}

	public function assignedprojectsAction() // ajax
	{
		$project = new Project();
		echo $project->fetchbyassignJson($this->sale_id);
		exit;
	}

	public function otherprojectsAction() // ajax
	{
		$project = new Project();
		echo $project->fetchothersJson($this->sale_id, DEFAULT_COMPNAY);
		exit;
	}

	public function quotesalesrepAction() // ajax
	{
		$quote = new Quote();
		echo $quote->fetchrelatedJson($this->sale_id);
		exit;
	}

	public function memoAction() // ajax
	{
		$memo = new ProjectNote();
		echo $memo->fetchmemobyowner($this->sale_id, true);
		exit;
	}

	public function quoteAction() // ajax
	{
		$quote = new Quote();
		echo $quote->getAdminQuotes();
		exit;
	}

	public function projectAction() // ajax
	{
		$project = new Project();
		echo $project->getAdminProjects();
		exit;
	}

	public function approvalwaitingAction() // ajax
	{
		$quote = new Quote();
		if ($this->session->user['sale_role'] == 'admin') {
			$is_admin = true;
		} else {
			$is_admin = false;
		}
		echo $quote->fetchwaiting(1, $is_admin, true);
		exit;
	}

	public function approvalapprovedAction() // ajax
	{
		$quote = new Quote();
		if ($this->session->user['sale_role'] == 'admin') {
			$is_admin = true;
		} else {
			$is_admin = false;
		}
		echo $quote->fetchwaiting(10, $is_admin, true);
		exit;
	}

	public function approvaldisapprovedAction() // ajax
	{
		$quote = new Quote();
		if ($this->session->user['sale_role'] == 'admin') {
			$is_admin = true;
		} else {
			$is_admin = false;
		}
		echo $quote->fetchwaiting(-1, $is_admin, true);
		exit;
	}

}
