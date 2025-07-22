<?php

namespace Application\Controller;

use Application\Model\Specifier;
use Exception;
use Laminas\Mvc\Controller\AbstractActionController;
use Laminas\View\Model\JsonModel;

class SpecifierController extends AbstractActionController
{
    protected $specifier;

    public function __construct(Specifier $specifier)
    {
        $this->specifier = $specifier;
    }

    public function indexAction()
    {
        $request = $this->getRequest();

        if ($request->isPost()) {
            return $this->createAction();
        }

        $specifierID = $this->params()->fromRoute('id');

        if ($specifierID) {
            $specifier = $this->specifier->fetchSpecifierById($specifierID);

            if (! $specifier) {
                return new JsonModel([
                    'success' => false,
                    'message' => 'Specifier not found.'
                ]);
            }

            return new JsonModel([
                'success' => true,
                'specifier' => [
                    'first_name' => $specifier['first_name'],
                    'last_name' => $specifier['last_name'],
                    'job_title' => $specifier['job_title'],
                    'central_phone_number' => $specifier['central_phone_number'],
                    'email_address' => $specifier['email_address'],
                    'address_id' => $specifier['address_id'],
                ],
            ]);
        }

        return $this->notFoundAction();
    }

    public function createAction()
    {
        $architect_id = $this->params()->fromPost('architect_id', null);
        $data = $this->params()->fromPost();

        $missingFields = [];

        if (! $architect_id) {
            $missingFields[] = 'Architect ID';
        }
        if (empty($data['specifier_first_name'])) {
            $missingFields[] = 'First Name';
        }

        if (! $architect_id || empty($data['specifier_first_name'])) {
            return new JsonModel([
                'success' => false,
                'message' => 'Missing required fields: ' . implode(', ', $missingFields)
            ]);
        }

        try {
            $result = $this->specifier->add($data, $architect_id);

            return new JsonModel([
                'success' => true,
                'message' => 'Specifier added!',
                'note_id' => $result
            ]);
        } catch (Exception $e) {
            return new JsonModel([
                'success' => false,
                'message' => 'Failed to add specifier.',
                'error' => $e->getMessage()
            ]);
        }
    }

    public function editAction()
    {
        $request = $this->getRequest();
        $specifier_id = $this->params()->fromRoute('id');

        if (! $specifier_id) {
            return new JsonModel([
                'success' => false,
                'message' => 'Missing specifier ID.'
            ]);
        }

        if ($request->isPost()) {
            $data = $this->params()->fromPost();

            try {
                $result = $this->specifier->edit($data, $specifier_id);

                return new JsonModel([
                    'success' => true,
                    'message' => 'Specifier saved!',
                    'note_id' => $result
                ]);
            } catch (Exception $e) {
                return new JsonModel([
                    'success' => false,
                    'message' => 'Failed to edit specifier.',
                    'error' => $e->getMessage()
                ]);
            }
        }

        return $this->notFoundAction();
    }

    public function deleteAction()
    {
        $specifier_id = $this->params()->fromRoute('id', null);
        $request = $this->getRequest();

        if (! $specifier_id || ! $request->isXmlHttpRequest()) {
            return new JsonModel([
                'success' => false,
                'message' => 'Invalid request.',
            ]);
        }

        if ($request->isPost()) {
            try {
                $result = $this->specifier->delete($specifier_id);

                if ($result) {
                    return new JsonModel([
                        'success' => true,
                        'message' => 'Specifier deleted!',
                    ]);
                } else {
                    return new JsonModel([
                        'success' => false,
                        'message' => 'Failed to delete specifier.',
                    ]);
                }
            } catch (Exception $e) {
                return new JsonModel([
                    'success' => false,
                    'message' => 'Failed to delete specifier.',
                    'error' => $e->getMessage()
                ]);
            }
        }

        return $this->notFoundAction();
    }
}
