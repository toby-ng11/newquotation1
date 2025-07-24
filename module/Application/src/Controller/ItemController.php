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

    public function indexAction()
    {
        $request = $this->getRequest();

        if ($request->isPost()) { // save item
            return $this->forward()->dispatch(ItemController::class, [
                'action' => 'add',
            ]);
        } else {
            // search for item in P21
            $pattern = $this->params()->fromQuery('term', null);
            $limit = $this->params()->fromQuery('limit', 10);

            if ($pattern) {
                $item = $this->item->fetchItemsByPattern($pattern, $limit);
                return new JsonModel($item);
            }

            // fetch item from Quotation DB
            $itemUID = $this->params()->fromRoute('id');
            if ($itemUID) {
                $sheetType = $this->params()->fromQuery('type', null);

                if (! $sheetType) {
                    return new JsonModel([
                    'message' => 'Sheet type is required',
                    ]);
                }

                $item = $this->item->fetchItemByUID($itemUID, $sheetType);

                if (! $item) {
                    return new JsonModel([
                        'success' => false,
                        'message' => 'Item not found.'
                    ]);
                }

                return new JsonModel([
                    'success' => true,
                    'item' => [
                        'item_code' => $item['item_code'],
                        'quantity' => $item['quantity'],
                        'unit_price' => $item['unit_price'],
                        'unit_of_measure' => $item['unit_of_measure'],
                        'note' => $item['note'],
                    ],
                ]);
            }

            return new JsonModel([
                'message' => 'No item ID or pattern provided',
            ]);
        }
    }

    public function addAction()
    {
        $request = $this->getRequest();

        if ($request->isPost()) {
            $id = $this->params()->fromPost('sheet_id', null);
            $sheetType = $this->params()->fromPost('sheet_type', null);
            $data = $this->params()->fromPost();

            if (! $id || empty($data['item_code'])) {
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
        $item_uid = $this->params()->fromRoute('id', null);

        if (! $item_uid) {
            return new JsonModel([
                'success' => false,
                'message' => 'Missing item UID.'
            ]);
        }

        if ($request->isPost()) {
            $sheetType = $this->params()->fromPost('sheet_type', null);
            $data = $this->params()->fromPost();

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

        if (! $item_uid) {
            return new JsonModel([
                'success' => false,
                'message' => 'Missing item UID.'
            ]);
        }

        $item = $this->item->fetchItemByUID($item_uid, $sheetType);

        if (! $item) {
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

    public function deleteAction()
    {
        $item_uid = $this->params()->fromRoute('id', null);
        $sheetType = $this->params()->fromQuery('type', null);

        if (! $item_uid) {
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

    // Fetch UOM from P21
    public function uomAction()
    {
        $item_id = $this->params()->fromRoute('id', null);

        if (empty($item_id)) {
            return new JsonModel(['error' => 'Pattern is required']);
        }

        $uom = $this->item->fetchUomByItemId($item_id);

        return new JsonModel($uom);
    }

    // Fetch Price from P21
    public function priceAction()
    {
        $item_id = $this->params()->fromRoute('id', null);
        $uom = $this->params()->fromQuery('uom', null);

        if (empty($item_id) || empty($uom)) {
            return new JsonModel(['error' => 'Pattern is required']);
        }

        $price = $this->item->fetchItemPrice($item_id, $uom, true);

        return new JsonModel($price);
    }

    // Fetch saved price from Quotation
    public function quotedpriceAction()
    {
        $item_uid = $this->params()->fromRoute('id', null);
        $sheetType = $this->params()->fromQuery('type', null);

        if (empty($item_uid) || empty($sheetType)) {
            return new JsonModel(['error' => 'Pattern is required']);
        }

        $price = $this->item->fetchItemPrice($item_uid, null, false, $sheetType);

        return new JsonModel($price);
    }
}
