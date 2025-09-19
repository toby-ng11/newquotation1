<?php

namespace Application\Model;

use Application\Controller\QuoteController;
use Application\Helper\InputValidator;
use Application\Service\UserService;
use Laminas\Db\Adapter\Adapter;
use Laminas\Db\Adapter\Driver\ResultInterface;
use Laminas\Db\Adapter\Exception\ErrorException;
use Laminas\Db\ResultSet\ResultSet;
use Laminas\Db\Sql\{Sql, Expression};
use Laminas\Db\TableGateway\TableGatewayInterface;
use Laminas\Db\TableGateway\TableGateway;
use Psr\Container\ContainerInterface;

class Quote
{
    public const NOT_SUBMITTED     = 4;
    public const WAITING_APPROVAL = 1;
    public const APPROVED         = 2;
    public const DISAPPROVED      = 3;

    protected $adapter;
    protected $quote;
    protected $p2q_view_quote_x_project_x_oe;
    protected $container;

    public function __construct(
        Adapter $adapter,
        TableGateway $quote,
        TableGatewayInterface $p2q_view_quote_x_project_x_oe,
        ContainerInterface $container
    ) {
        $this->adapter = $adapter;
        $this->quote = $quote;
        $this->p2q_view_quote_x_project_x_oe = $p2q_view_quote_x_project_x_oe;
        $this->container = $container;
    }

    public function getUserService(): UserService
    {
        return $this->container->get(UserService::class);
    }

    public function getItem(): Item
    {
        return $this->container->get(Item::class);
    }

    public function getProject(): Project
    {
        return $this->container->get(Project::class);
    }

    public function create($data)
    {
        if (! $data) {
            return  false;
        }

        $user = $this->getUserService()->getCurrentUser();
        $adapter = $this->quote->getAdapter();
        $connection = $adapter->getDriver()->getConnection();
        $connection->beginTransaction();

        try {
            $info = [
                'project_id'         => $data['project_id'],
                'contact_id'         => $data['contact_id'],
                'status_id'          => Quote::NOT_SUBMITTED,
                'created_at'         => new Expression('GETDATE()'),
                'expire_date'        => new Expression('DATEADD(month, 2, GETDATE())'), // add 2 months to current date
                'ship_required_date' => $data['require_date'] ?? new Expression('GETDATE()'),
                'created_by'              => $user['id'],
                'updated_by'              => $user['id'],
                'updated_at'         => new Expression('GETDATE()'),
                'quote_type_id'      => 1,
                'company_id'         => $user['default_company'],
                'branch_id'          => $user['default_location_id'],
            ];

            $this->quote->insert($info);
            $newQuoteID = $this->quote->getLastInsertValue();

            if (! $newQuoteID) {
                throw new \RuntimeException('Failed to create quote.');
            }

            // Add extra info to quote
            $this->addQuoteExtraInfo($newQuoteID);

            // Transfer items from project to quote
            $projectItems = $this->getItem()->fetchExistItems($data['project_id'], 'project');
            if ($projectItems && is_array($projectItems)) {
                foreach ($projectItems as $item) {
                    $this->getItem()->add($item, $newQuoteID, 'quote', false);
                }
            }

            $connection->commit();
            return $newQuoteID;
        } catch (ErrorException $e) {
            $connection->rollback();
            error_log("Quote/create:Database Update Error: " . $e->getMessage());
            return false;
        }
    }

    public function addQuoteExtraInfo($quote_id)
    {
        if ($quote_id == null) {
            return  false;
        }

        $quote = $this->fetchById($quote_id);
        $project = $this->getProject()->fetchById($quote['project_id']);
        $allQuotes = $this->getProject()->quoteCountByProject($quote['project_id']);

        $data = [
            'quote_id_ext' => $this->formatQuoteIdExt($project['project_id_ext'], $allQuotes),
            'job_name' => mb_substr($project['project_name'], 0, 40, 'UTF-8'),
            'po_no' => mb_substr('P2Q - ' . $quote_id, 0, 40, 'UTF-8'),
        ];

        try {
            $this->quote->update($data, ['id' => $quote_id]);
        } catch (ErrorException $e) {
            error_log("Quote/updateQuoteExtraInfo:Database Update Error: " . $e->getMessage());
            return false;
        }
    }

    private function formatQuoteIdExt($projectExt, $quoteCount)
    {
        return $projectExt . '_' . str_pad($quoteCount, 5, '0', STR_PAD_LEFT);
    }

    public function edit($data, $quote_id)
    {
        if (! $data || ! $quote_id) {
            return  false;
        }

        $user = $this->getUserService()->getCurrentUser();

        $info = [
            'quote_type_id'      => $data['quote_type_id'],
            'contact_id'         => $data['contact_id'],
            'expire_date'        => $data['expire_date'] ?? new Expression('DATEADD(month, 2, GETDATE())'),
            'ship_required_date' => $data['ship_required_date'] ?? new Expression('GETDATE()'),
            'price_approve_id'   => ! empty($data['price_approve_id']) ? $data['price_approve_id'] : null,
            'lead_time_id'       => ! empty($data['lead_time_id']) ? $data['lead_time_id'] : null,
            'note'               => ! empty(trim($data['note'])) ? trim($data['note']) : null,
            'updated_at'         => new Expression('GETDATE()'),
            'updated_by'         => $user['id'],
            'company_id'         => empty($data['company_id']) ? $user['default_company'] : $data['company_id'],
        ];

        if ($info['company_id']) {
            $info['branch_id'] = $this->container->get(Location::class)->fetchBranchesFromCompany($info['company_id'])[0]['location_id'];
        }

        if (array_key_exists('request_action', $data)) {
            switch ($data['request_action']) {
                case QuoteController::ACTION_SUBMIT:
                    $info['status_id'] = Quote::WAITING_APPROVAL;
                    $info['submit_by'] = $user['id'];
                    break;
                case QuoteController::ACTION_SUBMIT_AGAIN:
                    $info['status_id'] = Quote::WAITING_APPROVAL;
                    $info['submit_by'] = $user['id'];
                    break;
                case QuoteController::ACTION_APPROVE:
                    $info['status_id'] = Quote::APPROVED;
                    $info['approve_date'] = new Expression('GETDATE()');
                    $info['approved_by'] = $user['id'];
                    break;
                case QuoteController::ACTION_DISAPPROVE:
                    $info['status_id'] = Quote::DISAPPROVED;
                    $info['price_approve_id'] = null;
                    $info['lead_time_id'] = null;
                    $info['approve_date'] = null;
                    $info['approved_by'] = null;
                    break;
                case QuoteController::ACTION_UNDO_SUBMIT:
                    $info['status_id'] = Quote::NOT_SUBMITTED;
                    $info['submit_by'] = null;
                    break;
                case QuoteController::ACTION_UNDO_APPROVE:
                    $info['status_id'] = Quote::WAITING_APPROVAL;
                    $info['price_approve_id'] = null;
                    $info['lead_time_id'] = null;
                    $info['approve_date'] = null;
                    $info['approved_by'] = null;
                    break;
                case QuoteController::ACTION_SUBMIT_APPROVE:
                    $info['status_id'] = Quote::APPROVED;
                    $info['submit_by'] = $user['id'];
                    $info['approve_date'] = new Expression('GETDATE()');
                    $info['approved_by'] = $user['id'];
                    break;
            }
        }

        if ($info['price_approve_id'] === null) {
            $info['status_id'] = Quote::WAITING_APPROVAL;
            $info['lead_time_id'] = null;
            $info['approve_date'] = null;
            $info['approved_by'] = null;
        }

        try {
            $this->quote->update($info, ['id' => $quote_id]);
            return true;
        } catch (ErrorException $e) {
            error_log("Quote/edit:Database Update Error: " . $e->getMessage());
            return false;
        }
    }

    public function editContact($contact_id, $quote_id)
    {
        if (! InputValidator::isValidId($contact_id) || ! InputValidator::isValidId($quote_id)) {
            return false;
        }

        $user = $this->getUserService()->getCurrentUser();

        $info = [
            'contact_id'         => $contact_id,
            'updated_at'         => new Expression('GETDATE()'),
            'updated_by'         => $user['id'],
        ];

        try {
            $this->quote->update($info, ['id' => $quote_id]);
            return true;
        } catch (ErrorException $e) {
            error_log("Quote/edit:Database Update Error: " . $e->getMessage());
            return false;
        }
    }

    public function delete($quote_id)
    {
        if (! $quote_id) {
            return false;
        }

        try {
            $quoteItems = $this->getItem()->fetchExistItems($quote_id, 'quote');
            if ($quoteItems && is_array($quoteItems)) {
                foreach ($quoteItems as $item) {
                    $this->getItem()->delete($item['id'], 'quote');
                }
            }

            $this->quote->delete(['id' => $quote_id]);

            return true;
        } catch (ErrorException $e) {
            error_log("Project/delete:Database Delete Error: " . $e->getMessage());
            return false;
        }
    }

    public function fetchById($quote_id, bool $view = false)
    {
        if ($view) {
            /** @var ResultInterface $rowset */
            $rowset = $this->p2q_view_quote_x_project_x_oe->select(['id' => $quote_id]);
            $row = $rowset->current();
            return $row;
        };

        /** @var ResultInterface $rowset */
        $rowset = $this->quote->select(['id' => $quote_id]);
        $row = $rowset->current();
        return $row;
    }

    public function fetchAll()
    {
        $rowset = $this->quote->select();
        return iterator_to_array($rowset, true);
    }

    public function fetchAllViews($location)
    {
        if ($location) {
            $rowset = $this->p2q_view_quote_x_project_x_oe
                ->select(['centura_location_id' => $location]);
            return iterator_to_array($rowset, true);
        }

        $rowset = $this->p2q_view_quote_x_project_x_oe->select();
        return iterator_to_array($rowset, true);
    }

    public function fetchOwnQuotes($user_id)
    {
        $rowset = $this->p2q_view_quote_x_project_x_oe->select(['created_by' => $user_id]);
        return iterator_to_array($rowset, true);
    }

    public function fetchApprovalTable($table)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();

        switch ($table) {
            case Quote::WAITING_APPROVAL:
                $select->from('p2q_view_quote_waiting');
                break;
            case Quote::APPROVED:
                $select->from('p2q_view_quote_approved');
                break;
            case Quote::DISAPPROVED:
                $select->from('p2q_view_quote_disapproved');
                break;
            default:
                return false;
        }

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        return iterator_to_array($result, true);
    }

    public function countApproval($table)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();

        switch ($table) {
            case Quote::WAITING_APPROVAL:
                $select->from('p2q_view_quote_waiting');
                break;
            case Quote::APPROVED:
                $select->from('p2q_view_quote_approved');
                break;
            case Quote::DISAPPROVED:
                $select->from('p2q_view_quote_disapproved');
                break;
            default:
                return false;
        }

        $select->columns(['total' => new Expression('COUNT(*)')]);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute()->current();
        return $result['total'] ?? 0;
    }

    public function countOwnQuotes($user_id)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('p2q_view_quote_x_project_x_oe')
            ->columns(['total' => new Expression('COUNT(*)')])
            ->where(['created_by' => $user_id]);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute()->current();
        return $result['total'] ?? 0;
    }

    public function fetchQuoteType()
    {
        $sql = new Sql($this->adapter);

        $select = $sql->select('quote_types')
            ->order('type_desc ASC');

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        return iterator_to_array($result, true);
    }

    public function fetchLeadTimes()
    {
        $sql = new Sql($this->adapter);

        $select = $sql->select('lead_times')
            ->order('lead_time_desc asc');

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        return iterator_to_array($result, true);
    }
}
