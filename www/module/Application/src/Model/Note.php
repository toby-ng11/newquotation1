<?php

namespace Application\Model;

use Laminas\Db\TableGateway\TableGateway;
use Laminas\Db\Sql\Select;
use Laminas\Db\Adapter\Adapter;
use Laminas\Db\Sql\{Sql, Expression};
use Exception;

use Application\Service\UserService;

class Note
{
    protected $adapter;
    protected $userService;
    protected $project_note;

    public function __construct(
        Adapter $adapter,
        UserService $userService,
        TableGateway $project_note
    )
    {
        $this->adapter = $adapter;
        $this->userService = $userService;
        $this->project_note = $project_note;
    }

    function add($data, $project_id) {
        if (!$data || !$project_id) {
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

    function edit($data, $note_id) {
        if (!$data || !$note_id) {
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

    function delete($note_id) {
        if (!$note_id) {
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
        if (!$id) {
			return false;
		}
        $sql = new Sql($this->adapter);
        $select = $sql->select('p2q_view_project_note')
            ->where([
                'project_id' => $id
            ]);

        $selectString = $sql->buildSqlString($select);
        $result = $this->adapter->query($selectString, $this->adapter::QUERY_MODE_EXECUTE);
        return $result;
    }
}