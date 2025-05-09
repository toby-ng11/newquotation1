<?php

namespace Application\Service;

use Application\Model\User;
use Application\Session\UserSession;

class UserService
{
	protected $userModel;

	public function __construct(User $userModel)
	{
		$this->userModel = $userModel;
	}

	public function getCurrentUser()
	{
		// Fetch Windows username
		$userName = str_replace(['CENTURA\\', 'centura\\'], '', $_SERVER['REMOTE_USER'] ?? '');

		// Fetch user details from the database
		$userData = $this->userModel->fetchsalebyid($userName);

		// Store in session
		$session = new UserSession();
		$session->user = [
			'id' => $userData['id'],
			'first_name' => $userData['first_name'],
			'last_name' => $userData['last_name'],
			'name' => $userData['name'],
			'email' => $userData['email_address'],
			'role' => $userData['role'],
			'role_uid' => $userData['role_uid'],
			'p2q_system_role' => $userData['p2q_system_role'],
		];

		if (in_array($session->user['p2q_system_role'], ['manager', 'admin'], true)) {
			$session->user['approve_id'] = $session->user['role_uid'];
		} else {
			$session->user['approve_id'] = null;
		}

		return $session->user;
	}

	public function fetchaAllApprovalID()
	{
		$id = $this->userModel->fetchaAllApprovalID();
		return $id;
	}
}
