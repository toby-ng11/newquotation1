<?php

class ItemController extends Zend_Controller_Action
{

    public function init()
    {
    
    }

    public function indexAction()
    {
        $patten = $this->getRequest()->getParam('term');
        $item = new Centura_Model_Item();
        
        $results = $item->fetchItemByPatten($patten);
        
     
        echo json_encode($results);
        
        exit;
    }
    public function uomAction()
    {
        $item_id = $this->getRequest()->getParam('id');
        $item = new Centura_Model_Item();
        
        $uom = $item->fetchUomByItemId($item_id);
        echo json_encode(($uom));
        exit;
        
    }
    
 	public function priceAction()
    {
        $item_id = $this->getRequest()->getParam('id');
        $uom = $this->getRequest()->getParam('uom');
        $item = new Centura_Model_Item();
        
        $price = $item->fetchItemPrice($item_id, $uom);
        echo json_encode($price);
        exit;
        
    }


}

