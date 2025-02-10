<?php

use Centura\Model\Specifier;

class SpecifierController extends Zend_Controller_Action {
    
    public function init() {
        
    }

    public function indexAction() {
        
    }

    public function addspecAction() {
        $data = $this->getRequest()->getParam('data');
        $specifier = new Specifier();
        $result = $specifier->addspec($data);
        echo json_encode($result);
        exit;
    }

    public function fetchspecbynameAction() {
        $name = $this->getRequest()->getParam('term');
        $specifier = new Specifier();
        $result = $specifier->fetchspecbyname($name);
        echo json_encode($result);
        exit;
    }

    public function fetchspecbyidAction() {
        $id = $this->getRequest()->getParam('id');
        $specifier = new Specifier();
        $result = $specifier->fetchspecbyid($id);
        echo json_encode($result);
        exit;
    }

}