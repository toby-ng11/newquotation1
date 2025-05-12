<?php

declare(strict_types=1);

namespace Application\Controller;

use Laminas\Mvc\Controller\AbstractActionController;
use Laminas\Mvc\Plugin\FlashMessenger;
use Laminas\Http\Response\Stream;
use Laminas\View\Model\{ViewModel, JsonModel};

use Application\Service\UserService;
use Application\Model\{Project, Quote, Location, Item, Customer};
use Application\Service\PdfExportService;

class QuoteController extends AbstractActionController
{
    protected $userService;
    protected $pdfExportService;
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
        PdfExportService $pdfExportService,
        Quote $quote,
        Project $project,
        Location $location,
        Item $item,
        Customer $customer
    ) {
        $this->userService = $userService;
        $this->pdfExportService = $pdfExportService;
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

        $quote_id = $this->quote->create($data);

        if ($quote_id) {
            $this->flashMessenger()->addSuccessMessage("Quote created successfully!");
            return new JsonModel([
                'success' => true,
                'quote_id' => $quote_id
            ]);
        } else {
            $this->flashMessenger()->addErrorMessage("Create quote failed. Please try again.");
            return new JsonModel([
                'success' => false,
                'message' => 'Failed to create quote.'
            ]);
        }
    }

    public function editAction()
    {
        $quote_id = $this->params()->fromRoute('id');

        $quote = $this->quote->fetchById($quote_id);
        if (!$quote || $quote['delete_flag'] === 'Y') {
            $this->flashMessenger()->addErrorMessage("This quote is deleted.");
            return $this->redirect()->toRoute('dashboard', ['action' => 'home']);
        }
        $user = $this->userService->getCurrentUser();
        $project = $this->project->fetchById($quote['project_id']);
        $quoteType = $this->quote->fetchQuoteType();
        $customer = $this->customer->fetchCustomerByContact($quote['contact_id']);
        $contact = $this->customer->fetchContactById($quote['contact_id']);
        $contactList = $this->customer->fetchContactsByCustomer($customer['customer_id']);
        $leadtime = $this->quote->fetchLeadTimes();
        $approvalUser = $this->userService->fetchaAllApprovalID();

        $admin = false;

        $this->layout()->setVariable('quoteID', $quote_id);
        $this->layout()->setVariable('projectID', $quote['project_id']);   //for sidebar
        $this->layout()->setVariable('quoteStatusID', $quote['quote_status_id']);
        $this->layout()->setVariable('approved', Quote::APPROVED);
        $this->layout()->setVariable('waitingApprove', Quote::WAITING_APPROVAL);
        $this->layout()->setVariable('disapproved', Quote::DISAPPROVED);

        if ($user['p2q_system_role'] === 'admin' || $user['approve_id'] !== null) {
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

        if ($result) {
            $this->flashMessenger()->addSuccessMessage("Quote deleted successfully!");

            if ($this->getRequest()->isXmlHttpRequest()) {
                return new JsonModel(['success' => $result]);
            }

            //return $this->redirect()->toRoute('dashboard', ['action' => 'home']);
        } else {
            $this->flashMessenger()->addErrorMessage("Failed to delete quote. Please try again.");

            if ($this->getRequest()->isXmlHttpRequest()) {
                return new JsonModel(['success' => $result]);
            }

            //return $this->redirect()->toRoute('quote', ['action' => 'edit', 'id' => $quote_id]);
        }
    }

    private function updateQuoteStatus($quote_id, $action, $successMsg, $autoSave = false)
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

        if ($result) {
            if (!$autoSave) {
                $this->flashMessenger()->addSuccessMessage($successMsg);
            }
        } else {
            $this->flashMessenger()->addErrorMessage("Failed to update quote status. Please try again.");
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
        return $this->updateQuoteStatus((int) $this->params()->fromRoute('id'), QuoteController::ACTION_SAVE, null, true);
    }

    public function submitAction()
    {
        return $this->updateQuoteStatus((int) $this->params()->fromRoute('id'), QuoteController::ACTION_SUBMIT, 'Quote submitted. Waiting for approval.');
    }

    public function undoSubmitAction()
    {
        return $this->updateQuoteStatus((int) $this->params()->fromRoute('id'), QuoteController::ACTION_UNDO_SUBMIT, 'Undo submitted quote!');
    }

    public function disapproveAction()
    {
        return $this->updateQuoteStatus((int) $this->params()->fromRoute('id'), QuoteController::ACTION_DISAPPROVE, 'Quote disapproved!');
    }

    public function approveAction()
    {
        return $this->updateQuoteStatus((int) $this->params()->fromRoute('id'), QuoteController::ACTION_APPROVE, 'Quote approved!');
    }

    public function undoApproveAction()
    {
        return $this->updateQuoteStatus((int) $this->params()->fromRoute('id'), QuoteController::ACTION_UNDO_APPROVE, 'Undo approved quote!');
    }

    public function submitAgainAction()
    {
        return $this->updateQuoteStatus((int) $this->params()->fromRoute('id'), QuoteController::ACTION_SUBMIT_AGAIN, 'Quote submitted again. Waiting for approval.'); //back to waiting status (2)
    }

    public function submitApproveAction()
    {
        return $this->updateQuoteStatus((int) $this->params()->fromRoute('id'), QuoteController::ACTION_SUBMIT_APPROVE, 'Quote submitted and approved!'); //back to waiting status (2)
    }

    public function exportAction()
    {
        $quote_id = $this->params()->fromRoute('id');

        $quote = $this->quote->fetchById($quote_id);
        $project = $this->project->fetchById($quote['project_id']);
        $customer = $this->customer->fetchCustomerByContact($quote['contact_id']);
        $contact = $this->customer->fetchContactById($quote['contact_id']);
        $quoteType = $this->quote->fetchQuoteType();
        $items = $this->item->fetchDataTables($quote_id, 'quote');
        $branches = $this->location->fetchAllBranches();
        $approvalUsers = $this->userService->fetchaAllApprovalID();

        $data = [
            'quote' => $quote,
            'project' => $project,
            'customer' => $customer,
            'contact' => $contact,
            'type' => $quoteType,
            'items' => $items,
            'branches' => $branches,
            'approvalList' => $approvalUsers
        ];

        $pdfContent = $this->pdfExportService->generatePdf('application/quote/export', $data);

        // Return PDF as a downloadable file
        $response = new Stream();
        $response->setStream(fopen('php://memory', 'wb+'));
        fwrite($response->getStream(), $pdfContent);
        rewind($response->getStream());

        $response->setStatusCode(200);
        $headers = $response->getHeaders();
        $headers->addHeaderLine('Content-Type', 'application/pdf');
        $headers->addHeaderLine('Content-Disposition', 'attachment; filename="' . $project['project_name'] . ' - ' . $customer['customer_name'] . '.pdf"');
        $headers->addHeaderLine('Content-Length', strlen($pdfContent));

        return $response;


        //return new ViewModel($data);

    }
}
