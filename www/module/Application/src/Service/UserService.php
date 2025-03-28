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
            'role_uid' => $userData['role_uid']
        ];

        $session->user['sale_role'] = 'guest';

        if (
			strpos($session->user['role'], 'Sales') !== false
			|| strpos($session->user['role'], 'VAN - Order Desk') !== false
			|| strpos($session->user['role'], 'CAL - Purchasing') !== false
		) {
			$session->user['sale_role'] = 'sales';
		}

		if (
			strpos($session->user['role'], 'Sales Management') !== false || strpos($session->user['role'], 'Sales Admin') !== false
			|| strpos($session->user['role'], 'VAN - Operation Manager') !== false
			|| strpos($session->user['role'], 'VAN - Accounts Receivable') !== false
			|| strpos($session->user['role'], 'EDM - Sales') !== false
		) {
			$session->user['sale_role'] = 'manager';
		}

		if (strpos($session->user['role'], 'IT') !== false) {
			$session->user['sale_role'] = 'admin';
		}

        $customUserManager = [
			// add custom user id here for quote approval
		];

		/* exceptional check roger provided list */
		if (in_array($session->user['id'], $customUserManager)) {
			$session->user['sale_role'] = 'manager';
		}

		if ($session->user['sale_role'] === 'manager' || $session->user['sale_role'] === 'admin') {
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