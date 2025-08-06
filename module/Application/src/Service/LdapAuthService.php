<?php

namespace Application\Service;

use Exception;
use Laminas\Ldap\Exception\LdapException;
use Laminas\Ldap\Ldap;

class LdapAuthService
{

    /** @var Ldap $ldap */
    protected $ldap;

    public function __construct(array $config)
    {
        $this->ldap = new Ldap($config);
    }

    public function authenticate(string $username, string $password): bool {
        try {
            $this->ldap->bind($username, $password);
            return true;
        } catch (LdapException $e) {
            //error_log($e->getMessage());
            return false;
        }
    }

    public function getLdap(): Ldap
    {
        return $this->ldap;
    }
}
