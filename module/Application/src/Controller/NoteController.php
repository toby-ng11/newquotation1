<?php

namespace Application\Controller;

use Laminas\Mvc\Controller\AbstractActionController;
use Laminas\View\Model\JsonModel;
use Exception;
use Application\Model\Note;

class NoteController extends AbstractActionController
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
            return $this->forward()->dispatch(NoteController::class, [
                'action' => 'add',
            ]);
        }

        return $this->forward()->dispatch(NoteController::class, [
            'action' => 'fetch', // you can implement an view note page
        ]);
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
                return new JsonModel([
                    'success' => false,
                    'message' => 'Missing required fields: ' . implode(', ', $missingFields)
                ]);
            }

            try {
                $result = $this->note->add($data, $id);

                return new JsonModel([
                    'success' => true,
                    'message' => 'Note added successfully!',
                    'note_id' => $result
                ]);
            } catch (Exception $e) {
                return new JsonModel([
                    'success' => false,
                    'message' => 'Failed to add note.',
                    'error' => $e->getMessage()
                ]);
            }
        }
    }

    public function editAction()
    {
        $request = $this->getRequest();
        $id = $this->params()->fromRoute('id');

        if (! $id) {
            return new JsonModel([
                'success' => false,
                'message' => 'Missing note ID.'
            ]);
        }

        if ($request->isPost()) {
            $data = $this->params()->fromPost();

            if (empty($data['project_note'])) {
                return new JsonModel([
                    'success' => false,
                    'message' => 'Missing required fields.'
                ]);
            }

            try {
                $result = $this->note->edit($data, $id);

                return new JsonModel([
                    'success' => true,
                    'message' => 'Note edit successfully!',
                    'note_id' => $result
                ]);
            } catch (Exception $e) {
                return new JsonModel([
                    'success' => false,
                    'message' => 'Failed to edit note.',
                    'error' => $e->getMessage()
                ]);
            }
        } else {
            try {
                $note = $this->note->fetchNote($id);

                if (! $note) {
                    return new JsonModel([
                        'success' => false,
                        'message' => 'Note not found.'
                    ]);
                }

                return new JsonModel([
                    'success' => true,
                    'note' => [
                        'note_title' => $note['title'],
                        'project_note' => $note['content'],
                        'next_action' => $note['next_action'],
                        'follow_up_date' => $note['notify_at'],
                    ],
                ]);
            } catch (\Exception $e) {
                return new JsonModel([
                    'success' => false,
                    'message' => 'Error loading note.',
                    'error' => $e->getMessage()
                ]);
            }
        }
    }

    public function deleteAction()
    {
        $note_id = $this->params()->fromRoute('id', null);
        $request = $this->getRequest();

        if (! $note_id || ! $request->isXmlHttpRequest()) {
            return new JsonModel([
                'success' => false,
                'message' => 'Invalid request.',
            ]);
        }

        try {
            $result = $this->note->delete($note_id);

            if ($result) {
                return new JsonModel([
                    'success' => true,
                    'message' => 'Note deleted successfully.',
                ]);
            } else {
                return new JsonModel([
                    'success' => false,
                    'message' => 'Failed to delete note.',
                ]);
            }
        } catch (Exception $e) {
            return new JsonModel([
                'success' => false,
                'message' => 'Failed to delete note.',
                'error' => $e->getMessage()
            ]);
        }
    }
}
