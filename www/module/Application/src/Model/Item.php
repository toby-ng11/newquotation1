<?php

namespace Application\Model;

use Laminas\Db\TableGateway\TableGateway;
use Laminas\Db\Sql\Select;
use Laminas\Db\Adapter\Adapter;
use Laminas\Db\Sql\{Sql, Expression};
use Exception;

use Application\Service\UserService;

class Item
{
    protected $adapter;
    protected $userService;
    protected $project_items;
    protected $quote_items;

    public function __construct(
        Adapter $adapter,
        UserService $userService,
        TableGateway $project_items,
        TableGateway $quote_items
    ) {
        $this->adapter = $adapter;
        $this->userService = $userService;
        $this->project_items = $project_items; // well you can modify the database using the same item table for project and quote :)
        $this->quote_items = $quote_items;
    }

    public function add($data, $id, $sheetType)
    {
        if (!$data || !$id || !$sheetType) {
            return false;
        }

        $user = $this->userService->getCurrentUser();

        $info = [
            'item_id'              => $data['item_id'],
            'quantity'             => $data['qty'],
            'note'                 => trim($data['note']),
            'unit_price'           => $data['price'],
            'uom'                  => $data['uom'],
            'subtotal'             => round($data['qty'] * $data['price'], 2),
            'added_by'             => $user['id'],
            'last_maintained_by'   => $user['id'],
            'date_add'             => new Expression('GETDATE()'),
            'date_last_maintained' => new Expression('GETDATE()'),
            'delete_flag'          => 'N'
        ];

        switch ($sheetType) {
            case 'project':
                $info['project_id'] = $id;
                try {
                    $this->project_items->insert($info);
                    return true;
                } catch (Exception $e) {
                    error_log("Item\add(project):Database Insert Error: " . $e->getMessage());
                    return false;
                }
                break;
            case 'quote':
                $info['quote_id'] = $id;
                try {
                    $this->quote_items->insert($info);
                    return true;
                } catch (Exception $e) {
                    error_log("Item\add(quote):Database Insert Error: " . $e->getMessage());
                    return false;
                }
                break;
            default:
                return false;
        }
    }

    public function edit($data, $item_uid, $sheetType)
    {
        if (!$data || !$item_uid || !$sheetType) {
            return false;
        }

        $user = $this->userService->getCurrentUser();

        $info = [
            'item_id'              => $data['item_id'],
            'quantity'             => $data['qty'],
            'note'                 => trim($data['note']),
            'unit_price'           => $data['price'],
            'uom'                  => $data['uom'],
            'subtotal'             => round($data['qty'] * $data['price'], 2),
            'last_maintained_by'   => $user['id'],
            'date_last_maintained' => new Expression('GETDATE()'),
            'delete_flag'          => 'N'
        ];

        switch ($sheetType) {
            case 'project':
                try {
                    $this->project_items->update($info, ['item_uid' => $item_uid]);
                    return true;
                } catch (Exception $e) {
                    error_log("Item/edit(project):Database Insert Error: " . $e->getMessage());
                    return false;
                }
                break;
            case 'quote':
                try {
                    $this->quote_items->update($info, ['item_uid' => $item_uid]);
                    return true;
                } catch (Exception $e) {
                    error_log("Item/edit(quote):Database Insert Error: " . $e->getMessage());
                    return false;
                }
                break;
            default:
                return false;
        }
    }

    public function delete($item_uid, $sheetType)
    {
        if (!$item_uid || !$sheetType) {
            return false;
        }

        $user = $this->userService->getCurrentUser();

        $info = [
            'last_maintained_by'   => $user['id'],
            'date_last_maintained' => new Expression('GETDATE()'),
            'delete_flag'          => 'Y'
        ];

        switch ($sheetType) {
            case 'project':
                try {
                    $this->project_items->update($info, ['item_uid' => $item_uid]);
                    return true;
                } catch (Exception $e) {
                    error_log("Item\delete(project):Database Insert Error: " . $e->getMessage());
                    return false;
                }
                break;
            case 'quote':
                try {
                    $this->quote_items->update($info, ['item_uid' => $item_uid]);
                    return true;
                } catch (Exception $e) {
                    error_log("Item\delete(quote):Database Insert Error: " . $e->getMessage());
                    return false;
                }
                break;
            default:
                return false;
        }
    }

    public function fetchItemsByPattern($pattern, $limit = 10, $location = DEFAULT_LOCATION_ID)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select('P21_Items')
            ->columns(['item_id', 'item_desc', 'location_id'])
            ->where(['location_id' => $location])
            ->where(function ($where) use ($pattern) {
                $where->nest()->like('item_id', $pattern . '%')
                    ->or
                    ->like('item_desc', $pattern . '%')
                    ->unnest();
            })
            ->order('item_id ASC')
            ->limit($limit);

        $selectString = $sql->buildSqlString($select);
        $result = $this->adapter->query($selectString, $this->adapter::QUERY_MODE_EXECUTE);
        return $result;
    }

    public function fetchItemByUID($item_uid, $sheetType) {
        if (!$item_uid || !$sheetType) {
            return false;
        }

        switch ($sheetType) {
            case 'project':
                $result = $this->project_items->select(['item_uid' => $item_uid]);
                break;
            case 'quote':
                $result = $this->quote_items->select(['item_uid' => $item_uid]);
                break;
            default:
                return false;
        }

        return $result->current();
    }

    public function fetchUomByItemId($item_id, $location = DEFAULT_LOCATION_ID)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select('P21_Items_x_uom')
            ->columns(['uom' => 'unit_of_measure'])
            ->where([
                'location_id' => $location,
                'item_id' => $item_id
            ])
            ->order('default_selling_unit DESC');

        $selectString = $sql->buildSqlString($select);
        $result = $this->adapter->query($selectString, $this->adapter::QUERY_MODE_EXECUTE);
        return $result;
    }

    public function fetchItemPrice($item_id, $uom, $location = DEFAULT_LOCATION_ID)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select('P21_Items_x_uom')
            ->columns(['price'])
            ->where([
                'location_id' => $location,
                'item_id' => $item_id,
                'unit_of_measure' => $uom
            ])
            ->quantifier(Select::QUANTIFIER_DISTINCT);

        $selectString = $sql->buildSqlString($select);
        $result = $this->adapter->query($selectString, $this->adapter::QUERY_MODE_EXECUTE);
        return $result->current();
    }

    public function fetchDataTables($project_id, $sheetType, $location = DEFAULT_LOCATION_ID)
    {
        $sql = new Sql($this->adapter);

        switch ($sheetType) {
            case 'project':
                $select = $sql->select('p2q_view_project_items')
                    ->where([
                        'location_id' => $location,
                        'project_id' => $project_id
                    ]);
                break;
            case 'quote':
                $select = $sql->select('p2q_view_quote_items')
                    ->where([
                        'location_id' => $location,
                        'quote_id' => $project_id
                    ]);
                break;
            default:
                return false;
        }

        $selectString = $sql->buildSqlString($select);
        $result = $this->adapter->query($selectString, $this->adapter::QUERY_MODE_EXECUTE);
        return $result;
    }
}
