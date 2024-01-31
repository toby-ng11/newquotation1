<?php

use Centura\Model\Item;

class ItemController extends Zend_Controller_Action
{

    public function init()
    {
    
    }

    public function indexAction()
    {
        $patten = $this->getRequest()->getParam('term');
        $item = new Item();
        
        $results = $item->fetchItemByPatten($patten);
        
     
        echo json_encode($results);
        
        exit;
    }
    public function uomAction()
    {
        $item_id = $this->getRequest()->getParam('id');
        $item = new Item();
        
        $uom = $item->fetchUomByItemId($item_id);
        echo json_encode(($uom));
        exit;
        
    }
    
 	public function priceAction()
    {
        $item_id = $this->getRequest()->getParam('id');
        $uom = $this->getRequest()->getParam('uom');
        $item = new Item();
        
        $price = $item->fetchItemPrice($item_id, $uom);
        echo json_encode($price);
        exit;
        
    }


}

