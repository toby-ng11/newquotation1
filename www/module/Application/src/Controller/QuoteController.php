<?php

declare(strict_types=1);

namespace Application\Controller;

use Laminas\Mvc\Controller\AbstractActionController;
use Laminas\Mvc\Plugin\FlashMessenger;
use Laminas\View\Model\{ViewModel, JsonModel};

use Application\Service\UserService;
use Application\Model\{Project, Quote, Location, Item, Customer};

class QuoteController extends AbstractActionController
{
    protected $userService;
    protected $quote;
    protected $project;
    protected $location;
    protected $item;
    protected $customer;

    const ACTION_SAVE         = 1;
    const ACTION_SUBMIT       = 2;
    const ACTION_SUBMIT_AGAIN = 3;
    const ACTION_APPROVE      = 4;
    const ACTION_DISAPPROVE   = 5;
    const ACTION_UNDO_SUBMIT  = 6;
    const ACTION_UNDO_APPROVE = 7;
    const ACTION_SUBMIT_APPROVE = 8;


    public function __construct(
        UserService $userService,
        Quote $quote,
        Project $project,
        Location $location,
        Item $item,
        Customer $customer
    ) {
        $this->userService = $userService;
        $this->quote = $quote;
        $this->project = $project;
        $this->location = $location;
        $this->item = $item;
        $this->customer = $customer;
    }

    public function indexAction()
    {
        $request = $this->getRequest();

        if ($request->isPost() && !$this->params()->fromRoute('id')) {
            return $this->createAction();
        }

        if ($request->isGet() && $this->params()->fromRoute('id')) {
            return $this->viewAction();
        }
    }

    public function createAction()
    {
        $request = $this->getRequest();
        if (!$request->isPost()) {
            return $this->getResponse()->setStatusCode(405); // Method Not Allowed
        }

        $data = $this->params()->fromPost();

        if ($data['sheetType'] === 'quote') {
            $projectData = $this->project->fetchById($data['project_id']);
            $projectData['contact_id'] = $data['contact_id'];
            $quote_id = $this->quote->create($projectData);
        } else {
            $quote_id = $this->quote->create($data);
        }

        if ($quote_id) {
            return new JsonModel([
                'success' => true,
                'quote_id' => $quote_id
            ]);
        } else {
            return new JsonModel([
                'success' => false,
                'message' => 'Failed to create quote.'
            ]);
        }
    }

    public function editAction()
    {
        $quote_id = $this->params()->fromRoute('id');

        $user = $this->userService->getCurrentUser();
        $quote = $this->quote->fetchById($quote_id);
        $project = $this->project->fetchById($quote['project_id']);
        $quoteType = $this->quote->fetchQuoteType();
        $customer = $this->customer->fetchCustomerByContact($quote['contact_id']);
        $contact = $this->customer->fetchContactById($quote['contact_id']);
        $contactList = $this->customer->fetchContactsByCustomer($customer['customer_id']);
        $leadtime = $this->quote->fetchLeadTimes();
        $approvalUser = $this->userService->fetchaAllApprovalID();

        $admin = false;

        if ($user['sale_role'] === 'admin' || $user['approve_id'] !== null) {
            $admin = true;
        }

        $request = $this->getRequest(); // for submit edit form

        if ($request->isPost()) {
            $data = $this->params()->fromPost();

            $result = $this->quote->edit($data, $quote_id);

            if ($result) {
                //$this->flashMessenger()->addSuccessMessage("Project saved successfully.");
                return $this->redirect()->toRoute('quote', [
                    'action' => 'edit',
                    'id' => $quote_id
                ]);
            } else {
                //$this->flashMessenger()->addErrorMessage("Save failed. Please try again.");
                return false;
            }
        }

        return new ViewModel([
            'user' => $user,
            'admin' => $admin,
            'quote' => $quote,
            'project' => $project,
            'type' => $quoteType,
            'customer' => $customer,
            'contact' => $contact,
            'contactList' => $contactList,
            'quote_status_not_submitted' => Quote::NOT_SUBMITTED,
            'quote_status_waiting' => Quote::WAITING_APPROVAL,
            'quote_status_approved' => Quote::APPROVED,
            'quote_status_disapproved' => Quote::DISAPPROVED,
            'approval' => $approvalUser,
            'leadtime' => $leadtime
        ]);
    }

    public function deleteAction()
    {
        $quote_id = (int) $this->params()->fromRoute('id');

        if (!$quote_id) {
            return new JsonModel(['success' => false, 'message' => 'Invalid quote ID']);
        }

        $result = $this->quote->delete($quote_id);

        if ($this->getRequest()->isXmlHttpRequest()) {
            return new JsonModel(['success' => $result]);
        }

        // Fallback if accessed normally (non-AJAX)
        if ($result) {
            return $this->redirect()->toRoute('dashboard', ['action' => 'project']);
        } else {
            return $this->redirect()->toRoute('quote', ['action' => 'edit', 'id' => $quote_id]);
        }
    }

    private function updateQuoteStatus($quote_id, $action, $successMsg)
    {
        if (!$quote_id) {
            return new JsonModel(['success' => false, 'message' => 'Invalid quote ID']);
        }

        $request = $this->getRequest();
        $result = false;

        if ($request->isPost()) {
            $data = $this->params()->fromPost();
            $data['request_action'] = $action;
            $result = $this->quote->edit($data, $quote_id);
        }

        if ($request->isXmlHttpRequest()) {
            return new JsonModel([
                'success' => $result,
                'message' => $result ? $successMsg : 'Failed to update quote.'
            ]);
        }

        return $this->redirect()->toRoute('quote', ['action' => 'edit', 'id' => $quote_id]);
    }

    public function saveAction()
    {
        return $this->updateQuoteStatus((int) $this->params()->fromRoute('id'), QuoteController::ACTION_SAVE, 'Quote saved.');
    }

    public function submitAction()
    {
        return $this->updateQuoteStatus((int) $this->params()->fromRoute('id'), QuoteController::ACTION_SUBMIT, 'Quote submitted. Waiting for approval.');
    }

    public function undoSubmitAction()
    {
        return $this->updateQuoteStatus((int) $this->params()->fromRoute('id'), QuoteController::ACTION_UNDO_SUBMIT, 'Undo submitted quote.');
    }

    public function disapproveAction()
    {
        return $this->updateQuoteStatus((int) $this->params()->fromRoute('id'), QuoteController::ACTION_DISAPPROVE, 'Quote disapproved.');
    }

    public function approveAction()
    {
        return $this->updateQuoteStatus((int) $this->params()->fromRoute('id'), QuoteController::ACTION_APPROVE, 'Quote approved.');
    }

    public function undoApproveAction()
    {
        return $this->updateQuoteStatus((int) $this->params()->fromRoute('id'), QuoteController::ACTION_UNDO_APPROVE, 'Undo approved quote.');
    }

    public function submitAgainAction()
    {
        return $this->updateQuoteStatus((int) $this->params()->fromRoute('id'), QuoteController::ACTION_SUBMIT_AGAIN, 'Quote submitted again. Waiting for approval.'); //back to waiting status (2)
    }

    public function submitApproveAction()
    {
        return $this->updateQuoteStatus((int) $this->params()->fromRoute('id'), QuoteController::ACTION_SUBMIT_APPROVE, 'Quote submitted and approved.'); //back to waiting status (2)
    }
}
