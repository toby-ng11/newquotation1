<?php

declare(strict_types=1);

namespace Application\Controller;

use Laminas\Mvc\Controller\AbstractActionController;
use Laminas\Http\Response\Stream;
use Laminas\View\Model\{ViewModel, JsonModel};
use Psr\Container\ContainerInterface;
use Application\Model\Quote;

class QuoteController extends AbstractActionController
{
    protected $container;

    public const ACTION_SAVE         = 1;
    public const ACTION_SUBMIT       = 2;
    public const ACTION_SUBMIT_AGAIN = 3;
    public const ACTION_APPROVE      = 4;
    public const ACTION_DISAPPROVE   = 5;
    public const ACTION_UNDO_SUBMIT  = 6;
    public const ACTION_UNDO_APPROVE = 7;
    public const ACTION_SUBMIT_APPROVE = 8;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    public function getUserService()
    {
        return $this->container->get(\Application\Service\UserService::class);
    }

    public function getPdfExportService()
    {
        return $this->container->get(\Application\Service\PdfExportService::class);
    }

    public function getQuoteModel()
    {
        return $this->container->get(\Application\Model\Quote::class);
    }

    public function getProjectModel()
    {
        return $this->container->get(\Application\Model\Project::class);
    }

    public function getLocationModel()
    {
        return $this->container->get(\Application\Model\Location::class);
    }

    public function getItemModel()
    {
        return $this->container->get(\Application\Model\Item::class);
    }

    public function getCustomerModel()
    {
        return $this->container->get(\Application\Model\Customer::class);
    }

    public function indexAction()
    {
        $request = $this->getRequest();

        if ($request->isPost() && ! $this->params()->fromRoute('id')) {
            return $this->createAction();
        }

        if ($request->isGet() && $this->params()->fromRoute('id')) {
            return $this->viewAction();
        }
    }

    public function createAction()
    {
        $request = $this->getRequest();
        if (! $request->isPost()) {
            return $this->getResponse()->setStatusCode(405); // Method Not Allowed
        }

        $data = $this->params()->fromPost();

        $quote_id = $this->getQuoteModel()->create($data);

        if ($quote_id) {
            $this->flashMessenger()->addSuccessMessage("Quote created successfully!");
            return new JsonModel([
                'success' => true,
                'quote_id' => $quote_id,
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

        $quote = $this->getQuoteModel()->fetchById($quote_id);
        if (! $quote || ($quote['deleted_at'])) {
            $this->flashMessenger()->addErrorMessage("This quote is deleted.");
            return $this->redirect()->toRoute('dashboard', ['action' => 'home']);
        }
        $user = $this->getUserService()->getCurrentUser();
        $project = $this->getProjectModel()->fetchById($quote['project_id']);
        $quoteType = $this->getQuoteModel()->fetchQuoteType();
        $customer = $this->getCustomerModel()->fetchCustomerByContact($quote['contact_id']);
        $contact = $this->getCustomerModel()->fetchContactById($quote['contact_id']);
        $contactList = $this->getCustomerModel()->fetchContactsByCustomer($customer['customer_id']);
        $leadtime = $this->getQuoteModel()->fetchLeadTimes();
        $approvalUser = $this->getUserService()->fetchaAllApprovalID();

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

            $result = $this->getQuoteModel()->edit($data, $quote_id);

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

        if (! $quote_id) {
            return new JsonModel(['success' => false, 'message' => 'Invalid quote ID']);
        }

        $result = $this->getQuoteModel()->delete($quote_id);

        if ($result) {
            $this->flashMessenger()->addSuccessMessage("Quote deleted successfully!");

            if ($this->getRequest()->isXmlHttpRequest()) {
                return new JsonModel(['success' => $result]);
            }

            return $this->redirect()->toRoute('dashboard', ['action' => 'home']);
        } else {
            $this->flashMessenger()->addErrorMessage("Failed to delete quote. Please try again.");

            if ($this->getRequest()->isXmlHttpRequest()) {
                return new JsonModel(['success' => $result]);
            }

            return $this->redirect()->toRoute('quote', ['action' => 'edit', 'id' => $quote_id]);
        }
    }

    private function updateQuoteStatus($quote_id, $action, $successMsg)
    {
        if (! $quote_id) {
            return new JsonModel(['success' => false, 'message' => 'Invalid quote ID']);
        }

        $request = $this->getRequest();
        $result = false;

        if ($request->isPost()) {
            $data = $this->params()->fromPost();
            $data['request_action'] = $action;
            $result = $this->getQuoteModel()->edit($data, $quote_id);
        }

        if ($result) {
            if ($request->isXmlHttpRequest()) {
                $isAutoSave = $this->getRequest()->getHeader('X-Auto-Save')?->getFieldValue() === 'true';
                if (! $isAutoSave) {
                    $this->flashMessenger()->addSuccessMessage($successMsg);
                }
                return new JsonModel([
                    'success' => $result,
                    'message' => $result ? $successMsg : 'Failed to update quote.',
                    'redirect' => $this->url()->fromRoute('quote', [
                        'action' => 'edit',
                        'id' => $quote_id
                    ])
                ]);
            }
        } else {
            if ($request->isXmlHttpRequest()) {
                $this->flashMessenger()->addErrorMessage("Failed to update quote status. Please try again.");
                return new JsonModel([
                    'success' => false,
                    'message' => 'Save failed. Please try again.',
                    'redirect' => $this->url()->fromRoute('quote', [
                        'action' => 'edit',
                        'id' => $quote_id
                    ])
                ]);
            }
        }
        return $this->redirect()->toRoute('quote', ['action' => 'edit', 'id' => $quote_id]);
    }

    public function saveAction()
    {
        return $this->updateQuoteStatus(
            (int) $this->params()->fromRoute('id'),
            QuoteController::ACTION_SAVE,
            'Quote saved!'
        );
    }

    public function submitAction()
    {
        return $this->updateQuoteStatus(
            (int) $this->params()->fromRoute('id'),
            QuoteController::ACTION_SUBMIT,
            'Quote submitted. Waiting for approval.'
        );
    }

    public function undoSubmitAction()
    {
        return $this->updateQuoteStatus(
            (int) $this->params()->fromRoute('id'),
            QuoteController::ACTION_UNDO_SUBMIT,
            'Undo submitted quote!'
        );
    }

    public function disapproveAction()
    {
        return $this->updateQuoteStatus(
            (int) $this->params()->fromRoute('id'),
            QuoteController::ACTION_DISAPPROVE,
            'Quote disapproved!'
        );
    }

    public function approveAction()
    {
        return $this->updateQuoteStatus(
            (int) $this->params()->fromRoute('id'),
            QuoteController::ACTION_APPROVE,
            'Quote approved!'
        );
    }

    public function undoApproveAction()
    {
        return $this->updateQuoteStatus(
            (int) $this->params()->fromRoute('id'),
            QuoteController::ACTION_UNDO_APPROVE,
            'Undo approved quote!'
        );
    }

    public function submitAgainAction()
    {
        return $this->updateQuoteStatus(
            (int) $this->params()->fromRoute('id'),
            QuoteController::ACTION_SUBMIT_AGAIN,
            'Quote submitted again. Waiting for approval.'
        ); //back to waiting status (2)
    }

    public function submitApproveAction()
    {
        return $this->updateQuoteStatus(
            (int) $this->params()->fromRoute('id'),
            QuoteController::ACTION_SUBMIT_APPROVE,
            'Quote submitted and approved!'
        ); //back to waiting status (2)
    }

    public function itemsAction()
    {
        $request = $this->getRequest();
        if ($request->isXmlHttpRequest()) {
            $id = $this->params()->fromRoute('id');
            $sheetType = 'quote';
            $itemTable = $this->getItemModel()->fetchDataTables($id, $sheetType);
            $view = new JsonModel($itemTable);
            return $view;
        }
        return $this->getResponse()->setStatusCode(404);
    }

    public function exportAction()
    {
        $quote_id = $this->params()->fromRoute('id');

        $quote = $this->getQuoteModel()->fetchById($quote_id);
        $project = $this->getProjectModel()->fetchById($quote['project_id']);
        $customer = $this->getCustomerModel()->fetchCustomerByContact($quote['contact_id']);
        $contact = $this->getCustomerModel()->fetchContactById($quote['contact_id']);
        $quoteType = $this->getQuoteModel()->fetchQuoteType();
        $items = $this->getItemModel()->fetchDataTables($quote_id, 'quote');
        $branches = $this->getLocationModel()->fetchAllBranches();
        $approvalUsers = $this->getUserService()->fetchaAllApprovalID();

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

        $pdfContent = $this->getPdfExportService()->generatePdf('application/quote/export', $data);

        // Return PDF as a downloadable file
        $response = new Stream();
        $response->setStream(fopen('php://memory', 'wb+'));
        fwrite($response->getStream(), $pdfContent);
        rewind($response->getStream());

        $response->setStatusCode(200);
        $headers = $response->getHeaders();
        $headers->addHeaderLine('Content-Type', 'application/pdf');
        $headers->addHeaderLine(
            'Content-Disposition',
            'attachment; filename="' . $project['project_name'] . ' - ' . $customer['customer_name'] . '.pdf"'
        );
        $headers->addHeaderLine('Content-Length', strlen($pdfContent));

        return $response;


        //return new ViewModel($data);
    }
}
