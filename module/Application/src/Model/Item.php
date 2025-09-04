<?php

namespace Application\Model;

use Application\Helper\InputValidator;
use Laminas\Db\ResultSet\ResultSet;
use Laminas\Db\TableGateway\TableGateway;
use Laminas\Db\Sql\Select;
use Laminas\Db\Adapter\Adapter;
use Laminas\Db\Adapter\Driver\ResultInterface;
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
        if (! InputValidator::isValidData($data) || ! InputValidator::isValidData($sheetType) || ! InputValidator::isValidId($id)) {
            return false;
        }

        $user = $this->userService->getCurrentUser();

        $info = [
            'item_code'             => $data['item_code'],
            'quantity'             => $data['quantity'] ?? 1,
            'note'                 => trim($data['note']),
            'unit_price'           => $data['unit_price'],
            'unit_of_measure'       => $data['unit_of_measure'],
            'total_price'            => round($data['quantity'] * $data['unit_price'], 2),
            'created_by'             => $user['id'],
            'updated_by'   => $user['id'],
            'created_at'             => new Expression('GETDATE()'),
            'updated_at' => new Expression('GETDATE()'),
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
        if (! InputValidator::isValidData($data) || ! InputValidator::isValidData($sheetType) || ! InputValidator::isValidId($item_uid)) {
            return false;
        }

        $user = $this->userService->getCurrentUser();

        $info = [
            'item_code'              => $data['item_code'],
            'quantity'             => $data['quantity'] ?? 1,
            'note'                 => trim($data['note']),
            'unit_price'           => $data['unit_price'],
            'unit_of_measure'                  => $data['unit_of_measure'],
            'total_price'             => round($data['quantity'] * $data['unit_price'], 2),
            'updated_by'   => $user['id'],
            'updated_at' => new Expression('GETDATE()'),
        ];

        switch ($sheetType) {
            case 'project':
                try {
                    $this->project_items->update($info, ['id' => $item_uid]);
                    return true;
                } catch (Exception $e) {
                    error_log("Item/edit(project):Database Insert Error: " . $e->getMessage());
                    return false;
                }
                break;
            case 'quote':
                try {
                    $this->quote_items->update($info, ['id' => $item_uid]);
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
        if (! InputValidator::isValidData($sheetType) || ! InputValidator::isValidId($item_uid)) {
            return false;
        }

        switch ($sheetType) {
            case 'project':
                try {
                    $this->project_items->delete(['id' => $item_uid]);
                    return true;
                } catch (Exception $e) {
                    error_log("Item\delete(project):Database Insert Error: " . $e->getMessage());
                    return false;
                }
                break;
            case 'quote':
                try {
                    $this->quote_items->delete(['id' => $item_uid]);
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
        if (! InputValidator::isValidPattern($pattern)) {
            return false;
        }

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
            ->limit($limit)->offset(0);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        return iterator_to_array($result, true);
    }

    public function fetchItemByUID($item_uid, $sheetType)
    {
        if (! InputValidator::isValidData($sheetType) || ! InputValidator::isValidId($item_uid)) {
            return false;
        }

        switch ($sheetType) {
            case 'project':
                /** @var ResultInterface $result */
                $result = $this->project_items->select(['id' => $item_uid]);
                break;
            case 'quote':
                /** @var ResultInterface $result */
                $result = $this->quote_items->select(['id' => $item_uid]);
                break;
            default:
                return false;
        }

        return $result->current();
    }

    public function fetchUomByItemId($item_id, $location = DEFAULT_LOCATION_ID)
    {
        if (! InputValidator::isValidData($item_id)) {
            return false;
        }

        $sql = new Sql($this->adapter);
        $select = $sql->select('P21_Items_x_uom')
            ->columns(['uom' => 'unit_of_measure'])
            ->where([
                'location_id' => $location,
                'item_id' => $item_id
            ])
            ->order('default_selling_unit DESC');

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        return iterator_to_array($result, true);
    }

    public function fetchItemPrice($item_id, $uom, $fromP21, $sheetType = '', $location = DEFAULT_LOCATION_ID)
    {
        if (! InputValidator::isValidData($item_id)) {
            return false;
        }

        $sql = new Sql($this->adapter);
        if ($fromP21) {
            $select = $sql->select('P21_Items_x_uom')
                ->columns(['price'])
                ->where([
                    'location_id' => $location,
                    'item_id' => $item_id,
                    'unit_of_measure' => $uom
                ])
                ->quantifier(Select::QUANTIFIER_DISTINCT);
        } else {
            switch ($sheetType) {
                case 'project':
                    $select = $sql->select('p2q_view_project_items')
                        ->columns(['unit_price'])
                        ->where(['id' => $item_id]);
                    break;
                case 'quote':
                    $select = $sql->select('p2q_view_quote_items')
                        ->columns(['unit_price'])
                        ->where(['id' => $item_id]);
                    break;
                default:
                    return false;
            }
        }

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        return $result->current();
    }

    public function fetchDataTables($project_id, $sheetType)
    {
        if (! InputValidator::isValidData($sheetType) || ! InputValidator::isValidId($project_id)) {
            return false;
        }

        $sql = new Sql($this->adapter);

        switch ($sheetType) {
            case 'project':
                $select = $sql->select('p2q_view_project_items')
                    ->where([
                        'project_id' => $project_id
                    ])
                    ->order('id DESC');
                break;
            case 'quote':
                $select = $sql->select('p2q_view_quote_items')
                    ->where([
                        'quote_id' => $project_id
                    ])
                    ->order('id DESC');
                break;
            default:
                return false;
        }

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        return iterator_to_array($result, true);
    }

    public function fetchExistItems(int|null $id, string $sheetType)
    {
        if (! InputValidator::isValidData($sheetType) || ! InputValidator::isValidId($id)) {
            return false;
        }

        switch ($sheetType) {
            case 'project':
                $select = $this->project_items->getSql()->select()
                    ->where([
                        'project_id' => $id,
                        'deleted_at IS NULL'
                    ]);
                /** @var ResultSet $rowset */
                $rowset = $this->project_items->selectWith($select);
                return $rowset->toArray();
            case 'quote':
                $select = $this->quote_items->getSql()->select()
                    ->where([
                        'quote_id' => $id,
                        'deleted_at IS NULL'
                    ]);
                /** @var ResultSet $rowset */
                $rowset = $this->quote_items->selectWith($select);
                return $rowset->toArray();
            default:
                return false;
        }
    }

    public function fetchItemQuoteTable($company = DEFAULT_COMPANY)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select('p2q_view_quote_items_full')
            ->columns([
                'id',
                'item_code',
                'item_desc',
                'quantity',
                'unit_price',
                'unit_of_measure',
                'total_price',
                'note',
                'quote_id',
                'customer_name',
                'contact_full_name',
                'project_name',
                'stockstatus'
            ])
            ->where(['company_id' => $company, 'approved_by IS NOT NULL'])
            ->order('id DESC');

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        return iterator_to_array($result, true);
    }
}
