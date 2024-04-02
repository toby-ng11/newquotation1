<?php

use Centura\Model\Project;
use Centura\Model\Quote;
use Centura\Model\ProjectMemo;

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

		if ($this->session->user['sale_role'] == 'admin' && APPLICATION_ENV == 'production' && $this->_getParam('normal') == null) {
			$this->redirect('/index/admin');
		}
		if ($this->session->user['approve_id'] != null && APPLICATION_ENV == 'production' && $this->_getParam('normal') == null) {
			$this->redirect('/index/approval');
		}

		$project = new Project();
		$quote = new Quote();
		$memo = new ProjectMemo();

		$this->view->ownproject = $project->fetchbyowner($this->sale_id);
		$this->view->ownquotes = $quote->fetchrelated($this->sale_id);

		$this->view->memo = $memo->fetchmemobyowner($this->sale_id);

		if ($this->session->user['approve_id'] != null) {
			$this->view->otherprojects = $project->fetchothers($this->sale_id, DEFAULT_COMPNAY);
		}
	}

	public function projectsalesrepAction() // ajax
	{
		$project = new Project();
		echo $project->fetchbyownerJson($this->sale_id);
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
		$memo = new ProjectMemo();
		echo $memo->fetchmemobyownerJson($this->sale_id);
		exit;
	}

	public function adminAction()
	{
		if ($this->session->user['sale_role'] != 'admin' && APPLICATION_ENV == 'production') {
			$this->redirect('/index/');
		}

		$quote = new Quote();
		$project = new Project();

		$this->view->ownproject = $quote->fetchtotal();
		$this->view->log = null;
		$this->view->projects = $project->fetchallproject();
	}

	public function quoteAction() // ajax
	{
		$quote = new Quote();
		echo $quote->fetchQuoteJson();
		exit;
	}

	public function projectAction() // ajax
	{
		$quote = new Project();
		echo $quote->fetchallprojectJson();
		exit;
	}

	public function approvalAction()
	{
		if ($this->session->user['approve_id'] == null && APPLICATION_ENV == 'production') {
			$this->redirect('/index');
		}
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

	public function approvalwaitingAction() // ajax
	{
		$quote = new Quote();
		if ($this->session->user['sale_role'] == 'admin') {
			$is_admin = true;
		} else {
			$is_admin = false;
		}
		echo $quote->fetchwaitingJson(1, $is_admin);
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
		echo $quote->fetchwaitingJson(10, $is_admin);
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
		echo $quote->fetchwaitingJson(-1, $is_admin);
		exit;
	}

}
