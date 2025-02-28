<?php

namespace Application\Session;

use Laminas\Session\Container;

class UserSession extends Container
{
    public function __construct()
    {
        parent::__construct('UserSession');
    }

    public function setUserData(array $userData)
    {
        $this->user = $userData;
    }

    public function getUserData()
    {
        return $this->user ?? null;
    }
}
