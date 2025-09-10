<?php

namespace Application\Model;

use Laminas\Db\Sql\{Sql, Expression};
use Application\Helper\InputValidator;
use Application\Service\UserService;
use Laminas\Db\Adapter\Adapter;
use Psr\Container\ContainerInterface;

class ProjectNote extends Model
{
    protected $timestamps = true;
    protected $userTracked = true;

    public function __construct(
        Adapter $adapter,
        UserService $userService,
        ContainerInterface $container,
    ) {
        parent::__construct($adapter, $userService, $container);
    }

    protected function prepareDataForCreate(array $data): array
    {
        $info = [
            'title' => trim($data['note_title']),
            'content' => trim($data['project_note']),
            'next_action' => trim($data['next_action']),
            'notify_at' => ! empty($data['follow_up_date']) ? $data['follow_up_date'] : null,
            'project_id' => $data['project_id'],
        ];

        $info = parent::prepareDataForCreate($info);
        return $info;
    }

    protected function prepareDataForUpdate(array $data, mixed $id = 0): array
    {
        $info = [
            'title' => trim($data['note_title']),
            'content' => trim($data['project_note']),
            'next_action' => trim($data['next_action']),
            'notify_at' => ! empty($data['follow_up_date']) ? $data['follow_up_date'] : null
        ];

        $info = parent::prepareDataForUpdate($info, $id);
        return $info;
    }

    public function fetchDataTables($id)
    {
        if (! InputValidator::isValidId($id)) {
            return false;
        }
        $adapter = $this->tableGateway->getAdapter();
        $sql = new Sql($adapter);
        $select = $sql->select('p2q_view_project_note')
            ->where([
                'project_id' => $id
            ]);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        return iterator_to_array($result, true);
    }

    public function fetchNote($id)
    {
        if (! InputValidator::isValidId($id)) {
            return false;
        }

        return $this->find($id);
    }

    public function fetchOwnNotes($user_id)
    {
        if (! InputValidator::isValidData($user_id)) {
            return false;
        }

        $adapter = $this->tableGateway->getAdapter();
        $sql = new Sql($adapter);
        $select = $sql->select('p2q_view_project_note')
            ->where([
                'created_by' => $user_id
            ]);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        return iterator_to_array($result, true);
    }

    public function countOwnNotes($user_id)
    {
        if (! InputValidator::isValidData($user_id)) {
            return false;
        }
        $adapter = $this->tableGateway->getAdapter();
        $sql = new Sql($adapter);
        $select = $sql->select();
        $select->from('p2q_view_project_note')
            ->columns(['total' => new Expression('COUNT(*)')])
            ->where(['created_by' => $user_id]);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute()->current();
        return $result['total'] ?? 0;
    }

    public function fetchPendingFollowUps(): array
    {
        return $this->findBy([
            "notify_at <= GETDATE()",
            "notify_at > DATEADD(MINUTE, -1, GETDATE())",
            "(is_notified IS NULL OR is_notified = 'N')",
            'deleted_at IS NOT NULL'
        ]);
    }

    public function markReminderSent($noteId)
    {
        if (! InputValidator::isValidId($noteId)) {
            return false;
        }

        return $this->update(['is_notified' => 'Y'], $noteId);
    }
}
