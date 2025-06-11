<?php

namespace Application\Model;

use Laminas\Db\Adapter\Adapter;
use Laminas\Db\TableGateway\TableGatewayInterface;
use Laminas\Db\TableGateway\TableGateway;
use Laminas\Db\Sql\{Sql, Expression};
use Laminas\Db\Adapter\Exception\ErrorException;

use Application\Service\UserService;

use Psr\Container\ContainerInterface;
use Application\Controller\QuoteController;

class Quote
{
    const NOT_SUBMITTED     = 5;
    const WAITING_APPROVAL = 2;
    const APPROVED         = 3;
    const DISAPPROVED      = 4;

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

    public function getUserService()
    {
        return $this->container->get(UserService::class);
    }

    public function getItem()
    {
        return $this->container->get(Item::class);
    }

    public function getProject()
    {
        return $this->container->get(Project::class);
    }

    public function create($data): ?int
    {
        if (!$data) {
            return  false;
        }

        $user = $this->getUserService()->getCurrentUser();
        $adapter = $this->quote->getAdapter();
        $connection = $adapter->getDriver()->getConnection();
        $connection->beginTransaction();

        try {

            $info = [
                'delete_flag'        => 'N',
                'project_id'         => $data['project_id'],
                'contact_id'         => $data['contact_id'],
                'status_id'             => Quote::NOT_SUBMITTED,
                'created_at'         => new Expression('GETDATE()'),
                'expire_date'        => new Expression('DATEADD(month, 2, GETDATE())'), // add 2 months to current date
                'ship_required_date' => ($data['require_date']) ?? null,
                'taker'              => $user['id'],
                'updated_at'         => new Expression('GETDATE()'),
            ];

            $this->quote->insert($info);
            $newQuoteID = $this->quote->getLastInsertValue();

            if (!$newQuoteID) {
                throw new \RuntimeException('Failed to create quote.');
            }

            // Add extra info to quote
            $this->addQuoteExtraInfo($newQuoteID);

            // Transfer items from project to quote
            $projectItems = $this->getItem()->fetchExistItems($data['project_id'], 'project');
            if ($projectItems && is_array($projectItems)) {
                foreach ($projectItems as $item) {
                    $this->getItem()->add($item, $newQuoteID, 'quote');
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
        $allQuotes = $this->getProject()->QuoteCountByProject($quote['project_id']);

        $data = [
            'quote_id_ext' => $this->formatQuoteIdExt($project['project_id_ext'], $allQuotes),
            'job_name' => substr($project['project_name'], 0, 40),
            'po_no' => substr('P2Q - ' . $quote_id, 0, 40),
        ];

        try {
            $this->quote->update($data, ['quote_id' => $quote_id]);
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
        if (!$data || !$quote_id) {
            return  false;
        }

        $user = $this->getUserService()->getCurrentUser();

        $info = [
            'type_id'            => $data['quote_type_id'],
            'contact_id'         => $data['contact_id'],
            'expire_date'        => $data['expire_date'] ?? null,
            'ship_required_date' => $data['ship_required_date'] ?? null,
            'price_approve_id'   => $data['price_approve_id'] ?? null,
            'lead_time_id'       => $data['lead_time_id'] ?? null,
            'note'               => $data['note'],
            'updated_at'         => new Expression('GETDATE()'),
        ];

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

        try {
            $this->quote->update($info, ['quote_id' => $quote_id]);
            return true;
        } catch (ErrorException $e) {
            error_log("Quote/edit:Database Update Error: " . $e->getMessage());
            return false;
        }
    }

    public function delete($quote_id)
    {
        if (!$quote_id) {
            return false;
        }

        try {
            $this->quote->update(['delete_flag' => 'Y','deleted_at' => new Expression('GETDATE()'),], ['quote_id' => $quote_id]);
            return true;
        } catch (ErrorException $e) {
            error_log("Project/delete:Database Delete Error: " . $e->getMessage());
            return false;
        }
    }

    public function fetchById($quote_id)
    {
        return $this->p2q_view_quote_x_project_x_oe->select(['quote_id' => $quote_id])->current();
    }

    public function fetchAll()
    {
        return $this->quote->select()->toArray();
    }

    public function fetchAllViews()
    {
        return $this->p2q_view_quote_x_project_x_oe->select()->toArray();
    }

    public function fetchOwnQuotes($user_id)
    {
        return $this->p2q_view_quote_x_project_x_oe->select(['taker' => $user_id])->toArray();
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
        return $result;
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
            ->where(['taker' => $user_id]);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute()->current();
        return $result['total'] ?? 0;
    }

    public function fetchQuoteType()
    {
        $sql = new Sql($this->adapter);

        $select = $sql->select('quote_type')
            ->order('type_desc ASC');

            $statement = $sql->prepareStatementForSqlObject($select);
            $result = $statement->execute();
        return $result;
    }

    public function fetchLeadTimes()
    {
        $sql = new Sql($this->adapter);

        $select = $sql->select('lead_times')
            ->order('lead_time_desc asc');

            $statement = $sql->prepareStatementForSqlObject($select);
            $result = $statement->execute();
        return $result;
    }
}
