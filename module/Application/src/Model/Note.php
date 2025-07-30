<?php

namespace Application\Model;

use Laminas\Db\TableGateway\TableGateway;
use Laminas\Db\Sql\Select;
use Laminas\Db\Adapter\Adapter;
use Laminas\Db\Sql\{Sql, Expression};
use Exception;
use Application\Service\UserService;
use Application\Helper\InputValidator;

class Note
{
    protected $adapter;
    protected $userService;
    protected $project_note;

    public function __construct(
        Adapter $adapter,
        UserService $userService,
        TableGateway $project_note
    ) {
        $this->adapter = $adapter;
        $this->userService = $userService;
        $this->project_note = $project_note;
    }

    public function add($data, $project_id)
    {
        if (! InputValidator::isValidData($data) || ! InputValidator::isValidId($project_id)) {
            return false;
        }

        $user = $this->userService->getCurrentUser();

        $info = [
            'project_id' => $project_id,
            'title' => trim($data['note_title']),
            'content' => trim($data['project_note']),
            'next_action' => trim($data['next_action']),
            'created_at' => new Expression('GETDATE()'),
            'created_by' => $user['id'],
            'notify_at' => ! empty($data['follow_up_date']) ? $data['follow_up_date'] : null
        ];

        try {
            $this->project_note->insert($info);
            return $this->project_note->getLastInsertValue();
        } catch (Exception $e) {
            error_log("Note\add:Database Insert Error: " . $e->getMessage());
            return false;
        }
    }

    public function edit($data, $note_id)
    {
        if (! InputValidator::isValidData($data) || ! InputValidator::isValidId($note_id)) {
            return false;
        }

        $user = $this->userService->getCurrentUser();

        $info = [
            'title' => trim($data['note_title']),
            'content' => trim($data['project_note']),
            'next_action' => trim($data['next_action']),
            'notify_at' => ! empty($data['follow_up_date']) ? $data['follow_up_date'] : null,
            'updated_at' => new Expression('GETDATE()'),
            'updated_by' => $user['id'],
        ];

        try {
            $this->project_note->update($info, ['id ' => $note_id]);
            return $note_id;
        } catch (Exception $e) {
            error_log("Note\add:Database Edit Error: " . $e->getMessage());
            return false;
        }
    }

    public function delete($note_id)
    {
        if (! InputValidator::isValidId($note_id)) {
            return false;
        }

        $info = [
            'deleted_at' => new Expression('GETDATE()'),
        ];

        try {
            $this->project_note->update($info, ['id ' => $note_id]);
            return $note_id;
        } catch (Exception $e) {
            error_log("Note\add:Database Delete Error: " . $e->getMessage());
            return false;
        }
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

        $result = $this->project_note->select(['id' => $id]);
        return $result->current();
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
