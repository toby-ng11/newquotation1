<?php

use Centura\Model\User;

class UserController extends Zend_Controller_Action {
    public function init() {
        $this->session =  Zend_Registry::get('session');
    }

    public function indexAction() {
        var_dump(5);
        exit;
    }

    public function idAction() {

        $pattern = $this->getRequest()->getParam('term');
        $user = new User();

        $result = $user->fetchUserIdByPattern($pattern, 10);
        echo Zend_Json::encode($result);
        exit;
    }
}