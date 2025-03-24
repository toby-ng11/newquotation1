<?php

namespace Application\Controller;

use Laminas\Mvc\Controller\AbstractActionController;
use Laminas\View\Model\JsonModel;
use Exception;

use Application\Model\Item;

class ItemController extends AbstractActionController
{
    protected $item;

    public function __construct(Item $item)
    {
        $this->item = $item;
    }

    public function tableAction() {
        $request = $this->getRequest();
        if ($request->isXmlHttpRequest()) { 
            $id = $this->params()->fromQuery('id');
            $sheetType = $this->params()->fromQuery('type');
            $itemTable = $this->item->fetchDataTables($id, $sheetType);
            $view = new JsonModel($itemTable);
            return $view;
        }
        return $this->getResponse()->setStatusCode(404);
    }

    public function addAction()
    {
        $request = $this->getRequest();

        if ($request->isPost()) {
            $id = $this->params()->fromPost('project_id', null);
            $sheetType = $this->params()->fromPost('type', null);
            $data = $this->params()->fromPost();

            if (!$id || empty($data['item_id'])) {
                return new JsonModel([
                    'success' => false,
                    'message' => 'Missing required fields.'
                ]);
            }

            try {
                $result = $this->item->add($data, $id, $sheetType);
    
                return new JsonModel([
                    'success' => true,
                    'message' => 'Item added successfully!',
                    'item_id' => $result
                ]);
            } catch (Exception $e) {
                return new JsonModel([
                    'success' => false,
                    'message' => 'Failed to add item.',
                    'error' => $e->getMessage()
                ]);
            }
        }

        return new JsonModel([
            'success' => false,
            'message' => 'Invalid request method.'
        ]);
    }

    public function editAction()
    {
        $request = $this->getRequest();

        if ($request->isPost()) {
            $item_uid = $this->params()->fromPost('item_uid', null);
            $sheetType = $this->params()->fromPost('type', null);
            $data = $this->params()->fromPost();

            if (!$item_uid || empty($data['item_id'])) {
                return new JsonModel([
                    'success' => false,
                    'message' => 'Missing required fields.'
                ]);
            }

            try {
                $result = $this->item->edit($data, $item_uid, $sheetType);
    
                return new JsonModel([
                    'success' => true,
                    'message' => 'Item saved!',
                    'item_id' => $result
                ]);
            } catch (Exception $e) {
                return new JsonModel([
                    'success' => false,
                    'message' => 'Failed to edit item.',
                    'error' => $e->getMessage()
                ]);
            }
        }

        return new JsonModel([
            'success' => false,
            'message' => 'Invalid request method.'
        ]);
    }

    public function fetchAction() // fetch for edit
    {
        $item_uid = $this->params()->fromQuery('uid', null);
        $sheetType = $this->params()->fromQuery('type', null);

        if (!$item_uid) {
            return new JsonModel([
                'success' => false,
                'message' => 'Missing item UID.'
            ]);
        }

        $item = $this->item->fetchItemByUID($item_uid, $sheetType);

        if (!$item) {
            return new JsonModel([
                'success' => false,
                'message' => 'Item not found.'
            ]);
        }
    
        return new JsonModel([
            'success' => true,
            'data' => $item
        ]);
    }

    public function deleteAction() {
        $item_uid = $this->params()->fromQuery('uid', null);
        $sheetType = $this->params()->fromQuery('type', null);

        if (!$item_uid) {
            return new JsonModel([
                'success' => false,
                'message' => 'Missing item UID.'
            ]);
        }

        try {
            $result = $this->item->delete($item_uid, $sheetType);

            return new JsonModel([
                'success' => true,
                'message' => 'Item deleted!',
                'item_id' => $result
            ]);
        } catch (Exception $e) {
            return new JsonModel([
                'success' => false,
                'message' => 'Failed to delete item.',
                'error' => $e->getMessage()
            ]);
        }
    }

    public function indexAction()
    {
        $pattern = $this->params()->fromQuery('term', null);
        $limit = $this->params()->fromQuery('limit', 10);

        if (empty($pattern)) {
            return new JsonModel(['error' => 'Pattern is required']);
        }

        $item = $this->item->fetchItemsByPattern($pattern, $limit);

        return new JsonModel($item);
    }

    public function uomAction()
    {
        $item_id = $this->params()->fromQuery('term', null);

        if (empty($item_id)) {
            return new JsonModel(['error' => 'Pattern is required']);
        }

        $uom = $this->item->fetchUomByItemId($item_id);

        return new JsonModel($uom);
    }

    public function priceAction()
    {
        $item_id = $this->params()->fromQuery('item_id', null);
        $uom = $this->params()->fromQuery('uom', null);

        if (empty($item_id) || empty($uom)) {
            return new JsonModel(['error' => 'Pattern is required']);
        }

        $uom = $this->item->fetchItemPrice($item_id, $uom);

        return new JsonModel($uom);
    }
}
