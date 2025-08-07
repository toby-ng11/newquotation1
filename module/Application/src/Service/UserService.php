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

    /**
     * @return array{
     *     id: string,
     *     first_name: string,
     *     last_name: string,
     *     name: string,
     *     email_address: string,
     *     role: string,
     *     role_uid: string,
     *     p2q_system_role: string,
     *     default_company: string,
     *     default_location_id: string
     * }
     */
    public function getCurrentUser()
    {
        // Fetch Windows username
        $session = new UserSession();
        $user = $session->getUserData();
        $userName = $user['id'] ?? null;

        if ($userName === null) {
            return; // or throw exception
        }

        // Fetch user details from the database
        $userData = $this->userModel->fetchsalebyid($userName);

        // Store in session
        $session = new UserSession();
        $session->setUserData([
            'id' => (string) $userData['id'],
            'first_name' => (string) $userData['first_name'],
            'last_name' => (string) $userData['last_name'],
            'name' => (string) $userData['name'],
            'email_address' => (string) $userData['email_address'],
            'role' => (string) $userData['role'],
            'role_uid' => (string) $userData['role_uid'],
            'p2q_system_role' => (string) $userData['p2q_system_role'],
            'default_company' => (string) $userData['default_company'],
            'default_location_id' => (string) $userData['default_location_id'],
        ]);

        return $session->getUserData();
    }

    public function fetchaAllApprovalID(): array
    {
        $id = $this->userModel->fetchaAllApprovalID();
        return $id;
    }
}
