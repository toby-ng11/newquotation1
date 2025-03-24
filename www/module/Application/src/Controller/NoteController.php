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

    public function tableAction()
    {
        $request = $this->getRequest();
        if ($request->isXmlHttpRequest()) {
            $id = $this->params()->fromQuery('id');
            $noteTable = $this->note->fetchDataTables($id);
            $view = new JsonModel($noteTable);
            return $view;
        }
        return $this->getResponse()->setStatusCode(404);
    }

    public function addAction()
    {
        $request = $this->getRequest();

        if ($request->isPost()) {
            $id = $this->params()->fromPost('project_id', null);
            $data = $this->params()->fromPost();

            if (!$id || empty($data['project_note'])) {
                return new JsonModel([
                    'success' => false,
                    'message' => 'Missing required fields.'
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

        if ($request->isPost()) {
            $id = $this->params()->fromPost('note_id', null);
            $data = $this->params()->fromPost();

            if (!$id || empty($data['project_note'])) {
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
        }
    }

    public function deleteAction()
    {
        $note_id = $this->params()->fromQuery('note_id', null);

        if (!$note_id) {
            return new JsonModel([
                'success' => false,
                'message' => 'Missing note ID.'
            ]);
        }

        try {
            $result = $this->note->delete($note_id);

            return new JsonModel([
                'success' => true,
                'message' => 'Note deleted!',
                'item_id' => $result
            ]);
        } catch (Exception $e) {
            return new JsonModel([
                'success' => false,
                'message' => 'Failed to delete note.',
                'error' => $e->getMessage()
            ]);
        }
    }

    public function fetchAction() // fetch for edit
    {
        $note_id = $this->params()->fromQuery('id', null);

        if (!$note_id) {
            return new JsonModel([
                'success' => false,
                'message' => 'Missing note ID.'
            ]);
        }

        $note = $this->note->fetchNote($note_id);

        if (!$note) {
            return new JsonModel([
                'success' => false,
                'message' => 'Note not found.'
            ]);
        }
    
        return new JsonModel([
            'success' => true,
            'data' => $note
        ]);
    }
}
