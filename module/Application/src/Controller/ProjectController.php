<?php

declare(strict_types=1);

namespace Application\Controller;

use Laminas\Mvc\Controller\AbstractActionController;
use Laminas\Http\Response\Stream;
use Laminas\View\Model\{ViewModel, JsonModel};

use Application\Service\UserService;
use Application\Model\{Address, Project, Quote, Location, Item, Note, Architect, Specifier, Customer};
use Application\Service\PdfExportService;

class ProjectController extends AbstractActionController
{
    protected $userService;
    protected $pdfExportService;
    protected $project;
    protected $location;
    protected $item;
    protected $note;
    protected $architect;
    protected $address;
    protected $specifier;
    protected $customer;

    public function __construct(
        UserService $userService,
        PdfExportService $pdfExportService,
        Project $project,
        Location $location,
        Item $item,
        Note $note,
        Architect $architect,
        Address $address,
        Specifier $specifier,
        Customer $customer
    ) {
        $this->userService = $userService;
        $this->pdfExportService = $pdfExportService;
        $this->project = $project;
        $this->location = $location;
        $this->item = $item;
        $this->note = $note;
        $this->architect = $architect;
        $this->specifier = $specifier;
        $this->address = $address;
        $this->customer = $customer;
    }

    public function indexAction()
    {
        $request = $this->getRequest();

        if ($request->isPost()) {
            return $this->forward()->dispatch(ProjectController::class, [
                'action' => 'create',
            ]);
        }

        return $this->forward()->dispatch(ProjectController::class, [
            'action' => 'new',
        ]);
    }

    public function createAction()
    {
        $request = $this->getRequest();

        if ($request->isPost()) {
            $data = $this->params()->fromPost();

            $project_id = $this->project->save($data);

            if ($project_id) {
                if ($this->getRequest()->isXmlHttpRequest()) {
                    $this->flashMessenger()->addSuccessMessage("Project created successfully!");
                    return new JsonModel([
                        'success' => true,
                        'message' => 'Project created successfully!',
                        'redirect' => $this->url()->fromRoute('project', [
                            'action' => 'edit',
                            'id' => $project_id
                        ])
                    ]);
                }
                return $this->redirect()->toRoute('project', [
                    'action' => 'edit',
                    'id' => $project_id
                ]);
            } else {
                if ($this->getRequest()->isXmlHttpRequest()) {
                    $this->flashMessenger()->addErrorMessage("Failed to create project. Please try again!");
                    return new JsonModel([
                        'success' => false,
                        'message' => 'Failed to create project. Please try again!',
                        'redirect' => $this->url()->fromRoute('project', ['action' => 'index'])
                    ]);
                }
            }
        }
    }

    public function newAction()
    {
        $user = $this->userService->getCurrentUser();
        $company = $this->location->fetchAllCompanies();
        $location = $this->location->fetchAllBranches();
        $status = $this->project->fetchProjectStatus();
        $marketSegment = $this->project->fetchProjectSegment();
        $architectType = $this->architect->fetchArchitectType();

        return new ViewModel([
            'user' => $user,
            'company' => $company,
            'locations' => $location,
            'status' => $status,
            'seg' => $marketSegment,
            'architectType' => $architectType
        ]);
    }

    public function editAction()
    {
        $project_id = (int) $this->params()->fromRoute('id');

        if (!$project_id) {
            return $this->redirect()->toRoute('project');
        }

        $project = $this->project->fetchById($project_id);
        if (!$project || $project['delete_flag'] === 'Y') {
            $this->flashMessenger()->addErrorMessage("This project is deleted.");
            return $this->redirect()->toRoute('dashboard', ['action' => 'home']);
        }
        $user = $this->userService->getCurrentUser();
        $location = $this->location->fetchAllBranches();
        $company = $this->location->fetchAllCompanies();
        $status = $this->project->fetchProjectStatus();
        $marketSegment = $this->project->fetchProjectSegment();
        $architect = $this->architect->fetchArchitectById($project['architect_id']);
        $address = $this->address->fetchAddressesById($project['architect_address_id']);
        $specifier = $this->specifier->fetchSpecifierById($project['specifier_id']);
        $specifierAddress = null;

        if ($specifier && !empty($specifier['address_id'])) {
            $specifierAddress = $this->address->fetchAddressesById($specifier['address_id']);
        }
        $architectType = $this->architect->fetchArchitectType();
        $addressList = $this->address->fetchAddressesByArchitect($project['architect_id']);
        $specifierList = $this->specifier->fetchSpecifiersByArchitect($project['architect_id']);
        $generalContractor = $this->customer->fetchCustomerById($project['general_contractor_id']);
        $awardedContractor = $this->customer->fetchCustomerById($project['awarded_contractor_id']);

        $this->layout()->setVariable('id', $project_id); //for sidebar

        $owner = false;

        if ($user['id'] == $project['shared_id'] || $user['id'] == $project['owner_id'] || $user['p2q_system_role'] == 'admin' || $user['approve_id'] !== null) {
            $owner = true;
        }

        $admin = false;
        if ($user['p2q_system_role'] === 'admin' || $user['approve_id'] !== null) {
            $admin = true;
        }

        $request = $this->getRequest(); // for submit edit form

        if ($request->isPost()) {
            $data = $this->params()->fromPost();

            $result = $this->project->edit($data, $project_id);

            if ($result) {
                if ($request->isXmlHttpRequest()) {
                    $isAutoSave = $this->getRequest()->getHeader('X-Auto-Save')?->getFieldValue() === 'true';

                    if (!$isAutoSave) {
                        $this->flashMessenger()->addSuccessMessage("Project saved successfully!");
                    }

                    return new JsonModel([
                        'success' => true,
                        'message' => 'Project saved successfully.',
                        'redirect' => $this->url()->fromRoute('project', [
                            'action' => 'edit',
                            'id' => $project_id
                        ])
                    ]);
                }

                return $this->redirect()->toRoute('project', [
                    'action' => 'edit',
                    'id' => $project_id
                ]);
            } else {
                if ($request->isXmlHttpRequest()) {
                    return new JsonModel([
                        'success' => false,
                        'message' => 'Save failed. Please try again.',
                        'redirect' => $this->url()->fromRoute('project', [
                            'action' => 'edit',
                            'id' => $project_id
                        ])
                    ]);
                }
                $this->flashMessenger()->addErrorMessage("Save failed. Please try again.");
                return $this->redirect()->toRoute('project', ['action' => 'edit', 'id' => $project_id]);
            }
        }

        return new ViewModel([
            'id' => $project_id,
            'user' => $user,
            'project' => $project,
            'company' => $company,
            'location' => $location,
            'status' => $status,
            'marketSegment' => $marketSegment,
            'owner' => $owner,
            'admin' => $admin,
            'architect' => $architect,
            'address' => $address,
            'specifier' => $specifier,
            'specifierAddress' => $specifierAddress,
            'architectType' => $architectType,
            'specifierList' => $specifierList,
            'addressList' => $addressList,
            'generalContractor' => $generalContractor,
            'awardedContractor' => $awardedContractor
        ]);
    }

    public function editarchitectAction()
    {
        $request = $this->getRequest();

        if ($request->isPost()) {
            $project_id = (int) $this->params()->fromRoute('id');
            $data = $this->params()->fromPost();

            if (!$project_id) {
                return new JsonModel(['success' => false, 'message' => 'Invalid project ID']);
            }

            $result = $this->project->editArchitect($data, $project_id);

            // Fallback if accessed normally (non-AJAX)
            if ($result) {
                if ($this->getRequest()->isXmlHttpRequest()) {
                    $isAutoSave = $this->getRequest()->getHeader('X-Auto-Save')?->getFieldValue() === 'true';

                    if (!$isAutoSave) {
                        $this->flashMessenger()->addSuccessMessage("Project saved successfully!");
                    }

                    return new JsonModel([
                        'success' => true,
                        'message' => 'Project saved successfully.',
                        'redirect' => $this->url()->fromRoute('project', [
                            'action' => 'edit',
                            'id' => $project_id
                        ])
                    ]);
                }
                return $this->redirect()->toRoute('project', [
                    'action' => 'edit',
                    'id' => $project_id
                ]);
            } else {
                if ($request->isXmlHttpRequest()) {
                    return new JsonModel([
                        'success' => false,
                        'message' => 'Save failed. Please try again.',
                        'redirect' => $this->url()->fromRoute('project', [
                            'action' => 'edit',
                            'id' => $project_id
                        ])
                    ]);
                }
                $this->flashMessenger()->addErrorMessage("Save failed. Please try again.");
                return $this->redirect()->toRoute('project', ['action' => 'edit', 'id' => $project_id]);
            }
        } else {
            return $this->getResponse()->setStatusCode(404);
        }
    }

    public function deleteAction()
    {
        $project_id = (int) $this->params()->fromRoute('id');

        if (!$project_id) {
            return new JsonModel(['success' => false, 'message' => 'Invalid project ID']);
        }

        $result = $this->project->delete($project_id);

        // Fallback if accessed normally (non-AJAX)
        if ($result) {
            $this->flashMessenger()->addSuccessMessage("Project deleted successfully!");

            if ($this->getRequest()->isXmlHttpRequest()) {
                return new JsonModel(['success' => $result]);
            }

            //return $this->redirect()->toRoute('dashboard', ['action' => 'project']);
        } else {
            $this->flashMessenger()->addErrorMessage("Delete failed. Please try again.");
            //return $this->redirect()->toRoute('project', ['action' => 'edit', 'id' => $project_id]);
        }
    }

    public function noteAction()
    {
        $request = $this->getRequest();
        if ($request->isXmlHttpRequest()) {
            $id = $this->params()->fromRoute('id');
            $noteTable = $this->note->fetchDataTables($id);
            $view = new JsonModel($noteTable);
            return $view;
        }
        return $this->getResponse()->setStatusCode(404);
    }

    public function quotetableAction()
    {
        $request = $this->getRequest();
        if ($request->isXmlHttpRequest()) {
            $project_id = $this->params()->fromRoute('id');
            $projectQuotes = $this->project->fetchQuoteByProject($project_id);
            $view = new JsonModel($projectQuotes);
            return $view;
        }
        return $this->getResponse()->setStatusCode(404);
    }

    public function exportAction()
    {
        $project_id = $this->params()->fromRoute('id');

        $project = $this->project->fetchById($project_id);
        $architect = $this->architect->fetchArchitectById($project['architect_id']);
        $archAddress = $this->address->fetchAddressesById($project['architect_address_id']);
        $specifier = $this->specifier->fetchSpecifierById($project['specifier_id']);
        $generalContractor = $this->customer->fetchCustomerById($project['general_contractor_id']);
        $awardedContractor = $this->customer->fetchCustomerById($project['awarded_contractor_id']);
        $items = $this->item->fetchDataTables($project_id, 'project');
        $branches = $this->location->fetchAllBranches();

        $data = [
            'project' => $project,
            'items' => $items,
            'branches' => $branches,
            'architect' => $architect,
            'archAddress' => $archAddress,
            'specifier' => $specifier,
            'generalContractor' => $generalContractor,
            'awardedContractor' => $awardedContractor,
        ];

        $pdfContent = $this->pdfExportService->generatePdf('application/project/export', $data);

        // Return PDF as a downloadable file
        $response = new Stream();
        $response->setStream(fopen('php://memory', 'wb+'));
        fwrite($response->getStream(), $pdfContent);
        rewind($response->getStream());

        $response->setStatusCode(200);
        $headers = $response->getHeaders();
        $headers->addHeaderLine('Content-Type', 'application/pdf');
        $headers->addHeaderLine('Content-Disposition', 'attachment; filename="' . $project['project_name'] . '.pdf"');
        $headers->addHeaderLine('Content-Length', strlen($pdfContent));

        return $response;


        //return new ViewModel($data);

    }
}
