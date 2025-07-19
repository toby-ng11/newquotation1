<?php

namespace Application\View\Helper;

use Laminas\View\Helper\AbstractHelper;
use Laminas\Session\Container;

class UserHelper extends AbstractHelper
{
    public function __invoke()
    {
        $session = new Container('UserSession');
        return $session->offsetExists('user') ? $session->user : null;
    }
}
