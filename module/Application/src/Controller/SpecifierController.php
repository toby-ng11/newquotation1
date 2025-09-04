<?php

namespace Application\Controller;

use Application\Model\Specifier;
use Exception;

class SpecifierController extends BaseController
{
    protected $specifier;

    public function __construct(Specifier $specifier)
    {
        $this->specifier = $specifier;
    }

    public function indexAction()
    {
        $this->layout()->setTemplate('layout/default');
        $request = $this->getRequest();

        if ($request->isPost()) {
            return $this->createAction();
        }

        $specifierID = $this->params()->fromRoute('id');

        if ($specifierID) {
            $specifier = $this->specifier->fetchSpecifierById($specifierID);

            if (! $specifier) {
                return $this->json([
                    'success' => false,
                    'message' => 'Specifier not found.'
                ]);
            }

            return $this->json([
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

        return $this->abort404();
    }

    public function createAction()
    {
        $this->layout()->setTemplate('layout/default');
        $architect_id = $this->params()->fromPost('architect_id', null);
        $data = $this->params()->fromPost();

        error_log(print_r($data, true));

        $missingFields = [];

        if (! $architect_id) {
            $missingFields[] = 'Architect ID';
        }
        if (empty($data['specifier_first_name'])) {
            $missingFields[] = 'First Name';
        }

        if (! $architect_id || empty($data['specifier_first_name'])) {
            return $this->json([
                'success' => false,
                'message' => 'Missing required fields: ' . implode(', ', $missingFields)
            ]);
        }

        try {
            $result = $this->specifier->add($data, $architect_id);

            return $this->json([
                'success' => true,
                'message' => 'Specifier added!',
                'note_id' => $result
            ]);
        } catch (Exception $e) {
            return $this->json([
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
            return $this->json([
                'success' => false,
                'message' => 'Missing specifier ID.'
            ]);
        }

        if ($request->isPost()) {
            $data = $this->params()->fromPost();

            try {
                $result = $this->specifier->edit($data, $specifier_id);

                return $this->json([
                    'success' => true,
                    'message' => 'Specifier saved!',
                    'note_id' => $result
                ]);
            } catch (Exception $e) {
                return $this->json([
                    'success' => false,
                    'message' => 'Failed to edit specifier.',
                    'error' => $e->getMessage()
                ]);
            }
        }

        return $this->abort404();
    }

    public function deleteAction()
    {
        $specifier_id = $this->params()->fromRoute('id', null);
        $request = $this->getRequest();

        if (! $specifier_id) {
            return $this->json([
                'success' => false,
                'message' => 'Invalid request.',
            ]);
        }

        if ($request->isPost()) {
            try {
                $result = $this->specifier->delete($specifier_id);

                if ($result) {
                    return $this->json([
                        'success' => true,
                        'message' => 'Specifier deleted!',
                    ]);
                } else {
                    return $this->json([
                        'success' => false,
                        'message' => 'Failed to delete specifier.',
                    ]);
                }
            } catch (Exception $e) {
                return $this->json([
                    'success' => false,
                    'message' => 'Failed to delete specifier.',
                    'error' => $e->getMessage()
                ]);
            }
        }

        return $this->abort404();
    }
}
