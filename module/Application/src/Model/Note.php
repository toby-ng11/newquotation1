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

    function add($data, $project_id)
    {
        if (!InputValidator::isValidData($data) || !InputValidator::isValidId($project_id)) {
            return false;
        }

        $user = $this->userService->getCurrentUser();

        $info = [
            'project_id' => $project_id,
            'note_title' => trim($data['note_title']),
            'project_note' => trim($data['project_note']),
            'next_action' => trim($data['next_action']),
            'date_added' => new Expression('GETDATE()'),
            'owner_id' => $user['id'],
            'delete_flag' => 'N',
            'follow_up_date' => !empty($data['follow_up_date']) ? $data['follow_up_date'] : null
        ];

        try {
            $this->project_note->insert($info);
            return $this->project_note->getLastInsertValue();
        } catch (Exception $e) {
            error_log("Note\add:Database Insert Error: " . $e->getMessage());
            return false;
        }
    }

    function edit($data, $note_id)
    {
        if (!InputValidator::isValidData($data) || !InputValidator::isValidId($note_id)) {
            return false;
        }

        $info = [
            'note_title' => trim($data['note_title']),
            'project_note' => trim($data['project_note']),
            'next_action' => trim($data['next_action']),
            'follow_up_date' => !empty($data['follow_up_date']) ? $data['follow_up_date'] : null,
        ];

        try {
            $this->project_note->update($info, ['project_note_id ' => $note_id]);
            return $note_id;
        } catch (Exception $e) {
            error_log("Note\add:Database Edit Error: " . $e->getMessage());
            return false;
        }
    }

    function delete($note_id)
    {
        if (!InputValidator::isValidId($note_id)) {
            return false;
        }

        $info = [
            'delete_flag' => 'Y',
        ];

        try {
            $this->project_note->update($info, ['project_note_id ' => $note_id]);
            return $note_id;
        } catch (Exception $e) {
            error_log("Note\add:Database Delete Error: " . $e->getMessage());
            return false;
        }
    }

    public function fetchDataTables($id)
    {
        if (!InputValidator::isValidId($id)) {
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
        if (!InputValidator::isValidId($id)) {
            return false;
        }

        $result = $this->project_note->select(['project_note_id' => $id]);
        return $result->current();
    }

    public function fetchOwnNotes($user_id)
    {
        if (!InputValidator::isValidData($user_id)) {
            return false;
        }

        $sql = new Sql($this->adapter);
        $select = $sql->select('p2q_view_project_note')
            ->where([
                'owner_id' => $user_id
            ]);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        return $result;
    }

    public function countOwnNotes($user_id)
    {
        if (!InputValidator::isValidData($user_id)) {
            return false;
        }
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('p2q_view_project_note')
            ->columns(['total' => new Expression('COUNT(*)')])
            ->where(['owner_id' => $user_id]);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute()->current();
        return $result['total'] ?? 0;
    }

    public function fetchPendingFollowUps()
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select('project_note');
        $select->where([
            "follow_up_date <= GETDATE()",
            "follow_up_date > DATEADD(MINUTE, -1, GETDATE())",
            "(notified_flag IS NULL OR notified_flag != 'Y')",
            'delete_flag' => 'N'
        ]);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();

        return iterator_to_array($result);
    }

    public function markReminderSent($noteId)
    {
        if (!InputValidator::isValidId($noteId)) {
            return false;
        }

        $sql = new Sql($this->adapter);
        $update = $sql->update('project_note');
        $update->set(['notified_flag' => 'Y']);
        $update->where(['project_note_id' => $noteId]);

        $statement = $sql->prepareStatementForSqlObject($update);
        return $statement->execute();
    }
}
