<?php

class LogoutController extends Zend_Controller_Action
{

    public function init()
    {
        /* Initialize action controller here */
        $this->session =  Zend_Registry::get('session');
    }

    public function indexAction()
    {
   		echo "Session Has been cleared.";
   		echo( "<a href=\"#\" onclick=\"window.close(); return false\">CLOSE WINDOW</a>");
       exit;
    }


}

