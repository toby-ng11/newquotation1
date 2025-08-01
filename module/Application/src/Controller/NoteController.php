<?php

namespace Application\Controller;

use Application\Model\Note;
use Exception;

class NoteController extends BaseController
{
    protected $note;

    public function __construct(Note $note)
    {
        $this->note = $note;
    }

    public function indexAction()
    {
        $request = $this->getRequest();

        if ($request->isPost()) {
            return $this->addAction();
        }

        return $this->fetchAction();
    }

    public function addAction()
    {
        $request = $this->getRequest();

        if ($request->isPost()) {
            $id = $this->params()->fromPost('project_id', null);
            $data = $this->params()->fromPost();

            $missingFields = [];

            if (! $id) {
                $missingFields[] = 'id';
            }
            if (empty($data['project_note'])) {
                $missingFields[] = 'project_note';
            }

            if (! $id || empty($data['project_note'])) {
                return json_encode([
                    'success' => false,
                    'message' => 'Missing required fields: ' . implode(', ', $missingFields)
                ]);
            }

            try {
                $data['project_id'] = $id;
                $result = $this->note->create($data);

                return json_encode([
                    'success' => true,
                    'message' => 'Note added successfully!',
                    'note_id' => $result
                ]);
            } catch (Exception $e) {
                return json_encode([
                    'success' => false,
                    'message' => 'Failed to add note.',
                    'error' => $e->getMessage()
                ]);
            }
        }
        return $this->abort404();
    }

    public function editAction()
    {
        $request = $this->getRequest();
        $id = $this->params()->fromRoute('id');

        if (! $id) {
            return json_encode([
                'success' => false,
                'message' => 'Missing note ID.'
            ]);
        }

        if ($request->isPost()) {
            $data = $this->params()->fromPost();

            if (empty($data['project_note'])) {
                return json_encode([
                    'success' => false,
                    'message' => 'Missing required fields.'
                ]);
            }

            try {
                $result = $this->note->update($data, $id);

                return json_encode([
                    'success' => true,
                    'message' => 'Note edit successfully!',
                    'note_id' => $result
                ]);
            } catch (Exception $e) {
                return json_encode([
                    'success' => false,
                    'message' => 'Failed to edit note.',
                    'error' => $e->getMessage()
                ]);
            }
        } else {
            if ($request->isXmlHttpRequest()) {
                try {
                    $note = $this->note->fetchNote($id);

                    if (! $note) {
                        return json_encode([
                            'success' => false,
                            'message' => 'Note not found.'
                        ]);
                    }

                    return json_encode([
                        'success' => true,
                        'note' => [
                            'note_title' => $note['title'],
                            'project_note' => $note['content'],
                            'next_action' => $note['next_action'],
                            'follow_up_date' => $note['notify_at'],
                        ],
                    ]);
                } catch (\Exception $e) {
                    return json_encode([
                        'success' => false,
                        'message' => 'Error loading note.',
                        'error' => $e->getMessage()
                    ]);
                }
            }

            return $this->abort404();
        }
    }

    public function deleteAction()
    {
        $request = $this->getRequest();
        if ($request->isXmlHttpRequest()) {

            $note_id = $this->params()->fromRoute('id', null);

            if (! $note_id) {
                return json_encode([
                    'success' => false,
                    'message' => 'Missing note ID',
                ]);
            }

            try {
                $result = $this->note->delete($note_id);

                if ($result) {
                    return json_encode([
                        'success' => true,
                        'message' => 'Note deleted successfully.',
                    ]);
                } else {
                    return json_encode([
                        'success' => false,
                        'message' => 'Failed to delete note.',
                    ]);
                }
            } catch (Exception $e) {
                return json_encode([
                    'success' => false,
                    'message' => 'Failed to delete note.',
                    'error' => $e->getMessage()
                ]);
            }
        }

        return $this->abort404();
    }
}
