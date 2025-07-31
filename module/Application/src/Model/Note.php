<?php

namespace Application\Model;

use Laminas\Db\Adapter\Driver\ResultInterface;
use Laminas\Db\Sql\{Sql, Expression};
use Application\Helper\InputValidator;
use Laminas\Db\Adapter\Adapter;

class Note extends Model
{
    protected $timestamps = true;
    protected $userTracked = true;

    protected $adapter;

    public function __construct(Adapter $adapter)
    {
        $this->adapter = $adapter;
    }

    protected function prepareDataForCreate($data)
    {
        $info = [
            'title' => trim($data['note_title']),
            'content' => trim($data['project_note']),
            'next_action' => trim($data['next_action']),
            'notify_at' => ! empty($data['follow_up_date']) ? $data['follow_up_date'] : null
        ];

        $info = parent::prepareDataForCreate($info);
        return $info;
    }

    protected function prepareDataForUpdate($data, $id)
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

        $sql = new Sql($this->adapter);
        $select = $sql->select('p2q_view_project_note')
            ->where([
                'project_id' => $id
            ]);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        return $result;
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

        $sql = new Sql($this->adapter);
        $select = $sql->select('p2q_view_project_note')
            ->where([
                'created_by' => $user_id
            ]);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        return $result;
    }

    public function countOwnNotes($user_id)
    {
        if (! InputValidator::isValidData($user_id)) {
            return false;
        }
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('p2q_view_project_note')
            ->columns(['total' => new Expression('COUNT(*)')])
            ->where(['created_by' => $user_id]);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute()->current();
        return $result['total'] ?? 0;
    }

    public function fetchPendingFollowUps()
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select('project_notes');
        $select->where([
            "notify_at <= GETDATE()",
            "notify_at > DATEADD(MINUTE, -1, GETDATE())",
            "(is_notified IS NULL OR is_notified = 'N')",
            'deleted_at IS NOT NULL'
        ]);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();

        return iterator_to_array($result);
    }

    public function markReminderSent($noteId)
    {
        if (! InputValidator::isValidId($noteId)) {
            return false;
        }

        $sql = new Sql($this->adapter);
        $update = $sql->update('project_notes');
        $update->set(['is_notified' => 'Y']);
        $update->where(['id' => $noteId]);

        $statement = $sql->prepareStatementForSqlObject($update);
        return $statement->execute();
    }
}
