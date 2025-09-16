<?php

namespace Application\Controller;

use Application\Config\Defaults;
use Laminas\Http\Response\Stream;
use Laminas\View\Model\ViewModel;
use Psr\Container\ContainerInterface;

class ProjectController extends BaseController
{
    public function __construct(ContainerInterface $container)
    {
        parent::__construct($container);
    }

    public function indexAction()
    {
        $request = $this->getRequest();

        if ($request->isPost()) {
            return $this->createAction();
        }

        return $this->abort404();
    }

    public function createAction()
    {
        $user = $this->getUserService()->getCurrentUser();

        if ($user['p2q_system_role'] === 'guest') {
            return $this->abort403();
        }

        $request = $this->getRequest();

        if ($request->isPost()) {
            $data = $this->params()->fromPost();

            $project_id = $this->getProjectModel()->save($data);

            if ($project_id) {
                if ($this->getRequest()->isXmlHttpRequest()) {
                    $this->flashMessenger()->addSuccessMessage("Project created successfully!");
                    return $this->json([
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
                    return $this->json([
                        'success' => false,
                        'message' => 'Failed to create project. Please try again!',
                        'redirect' => $this->url()->fromRoute('project', ['action' => 'index'])
                    ]);
                }
            }
        }

        return $this->abort404();
    }

    public function newAction()
    {
        $user = $this->getUserService()->getCurrentUser();

        if ($user['p2q_system_role'] === 'guest') {
            return $this->abort403();
        }

        $this->layout()->setTemplate('layout/default');

        $company = $this->getP21LocationModel()->fetchAllCompanies();
        $location = $this->getP21LocationModel()->fetchAllBranches();
        $status = $this->getProjectModel()->fetchProjectStatus();
        $marketSegment = $this->getProjectModel()->fetchProjectSegment();
        $architectType = $this->getArchitectTypeModel()->all();

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
        $request = $this->getRequest(); // for submit edit form

        if ($request->isPost()) {
            $project_id = (int) $this->params()->fromRoute('id');
            $data = $this->params()->fromPost();

            $result = $this->getProjectModel()->edit($data, $project_id);

            if ($result) {
                if ($request->isXmlHttpRequest()) {
                    $isAutoSave = $this->getRequest()->getHeader('X-Auto-Save')?->getFieldValue() === 'true';

                    if (! $isAutoSave) {
                        $this->flashMessenger()->addSuccessMessage("Project saved successfully!");
                    }

                    return $this->json([
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
                    return $this->json([
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

        $user = $this->getUserService()->getCurrentUser();

        if ($user['p2q_system_role'] === 'guest') {
            return $this->abort403();
        }

        $project_id = (int) $this->params()->fromRoute('id');

        if (! $project_id) {
            return $this->redirect()->toRoute('project');
        }
        $project = $this->getProjectModel()->fetchById($project_id);

        $shareRecord  = $this->getProjectShareModel()->findBy([
            'project_id' => $project_id,
            'shared_user' => $user['id'],
        ]);
        $canSee = (
            $user['id'] === $project['created_by'] ||
            in_array($user['p2q_system_role'], ['admin', 'manager'], true) ||
            !empty($shareRecord)
        );

        if (!$canSee) {
            return $this->abort403();
        }

        if (! $project || ($project['deleted_at'])) {
            $this->flashMessenger()->addErrorMessage("This project is deleted.");
            return $this->redirect()->toRoute('index', ['action' => 'project']);
        }

        $location = $this->getP21LocationModel()->fetchAllBranches();
        $company = $this->getP21LocationModel()->fetchAllCompanies();
        $status = $this->getProjectModel()->fetchProjectStatus();
        $marketSegment = $this->getProjectModel()->fetchProjectSegment();
        $architect = $this->getArchitectModel()->fetchArchitectById($project['architect_id']);
        $address = $this->getAddressModel()->fetchAddressesById($project['architect_address_id']);
        $specifier = $this->getSpecifierModel()->fetchSpecifierById($project['specifier_id']);
        $specifierAddress = null;

        if ($specifier) {
            $specifierAddress = $this->getAddressModel()->fetchSpecifierAddress($specifier['id']);
        }
        $architectType = $this->getArchitectModel()->fetchArchitectType();
        $addressList = $this->getAddressModel()->fetchAddressesByArchitect($project['architect_id']);
        $specifierList = $this->getSpecifierModel()->fetchSpecifiersByArchitect($project['architect_id']);
        $generalContractor = $this->getCustomerModel()->fetchCustomerById($project['general_contractor_id']);
        $awardedContractor = $this->getCustomerModel()->fetchCustomerById($project['awarded_contractor_id']);

        $sharedRole = $shareRecord['role'] ?? null;

        $canEdit = (
            $sharedRole === 'editor' ||
            $user['id'] === $project['created_by'] ||
            in_array($user['p2q_system_role'], ['admin', 'manager'], true)
        );

        $this->layout()->setTemplate('layout/default');

        return new ViewModel([
            'id' => $project_id,
            'user' => $user,
            'defaultCompany' => Defaults::company(),
            'canEdit' => $canEdit,
            'project' => $project,
            'company' => $company,
            'location' => $location,
            'status' => $status,
            'marketSegment' => $marketSegment,
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

            if (! $project_id) {
                return $this->json(['success' => false, 'message' => 'Invalid project ID']);
            }

            $result = $this->getProjectModel()->editArchitect($data, $project_id);

            // Fallback if accessed normally (non-AJAX)
            if ($result) {
                if ($this->getRequest()->isXmlHttpRequest()) {
                    $isAutoSave = $this->getRequest()->getHeader('X-Auto-Save')?->getFieldValue() === 'true';

                    if (! $isAutoSave) {
                        $this->flashMessenger()->addSuccessMessage("Project saved successfully!");
                    }

                    return $this->json([
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
                    return $this->json([
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
            return $this->abort404();
        }
    }

    public function deleteAction()
    {
        if ($this->getRequest()->isXmlHttpRequest()) {
            $project_id = (int) $this->params()->fromRoute('id');

            if (! $project_id) {
                return $this->json([
                    'success' => false,
                    'message' => 'Invalid project ID'
                ]);
            }

            $result = $this->getProjectModel()->delete($project_id);

            if ($result) {
                $this->flashMessenger()->addSuccessMessage("Project deleted successfully!");
            } else {
                $this->flashMessenger()->addErrorMessage("Delete failed. Please try again.");
            }

            return $this->json([
                'success' => (bool) $result,
                'message' => $result ? 'Project deleted successfully!' : 'Delete failed. Please try again.'
            ]);
        }

        return $this->abort404();
    }

    public function sharesAction()
    {
        $request = $this->getRequest();
        if ($request->isXmlHttpRequest()) {
            $projectId = $this->params()->fromRoute('id');
            $shareTable = $this->getProjectShareModel()->findBy(['project_id' => $projectId]);
            $view = $this->json($shareTable);
            return $view;
        }
        return $this->abort404();
    }


    public function itemsAction()
    {
        $this->layout()->setTemplate('layout/default');
        $request = $this->getRequest();
        if ($request->isXmlHttpRequest()) {
            $id = $this->params()->fromRoute('id');
            $sheetType = 'project';
            $itemTable = $this->getItemModel()->fetchDataTables($id, $sheetType);
            $view = $this->json($itemTable);
            return $view;
        }
        return $this->abort404();
    }

    public function noteAction()
    {
        $request = $this->getRequest();
        if ($request->isXmlHttpRequest()) {
            $id = $this->params()->fromRoute('id');
            $noteTable = $this->getNoteModel()->fetchDataTables($id);
            $view = $this->json($noteTable);
            return $view;
        }
        return $this->abort404();
    }

    public function quotetableAction()
    {
        $request = $this->getRequest();
        if ($request->isXmlHttpRequest()) {
            $project_id = $this->params()->fromRoute('id');
            $projectQuotes = $this->getProjectModel()->fetchQuoteByProject($project_id);
            $view = $this->json($projectQuotes);
            return $view;
        }
        return $this->abort404();
    }

    public function exportAction()
    {
        $project_id = $this->params()->fromRoute('id');

        $project = $this->getProjectModel()->fetchById($project_id);
        $architect = $this->getArchitectModel()->fetchArchitectById($project['architect_id']);
        $archAddress = $this->getAddressModel()->fetchAddressesById($project['architect_address_id']);
        $specifier = $this->getSpecifierModel()->fetchSpecifierById($project['specifier_id']);
        $generalContractor = $this->getCustomerModel()->fetchCustomerById($project['general_contractor_id']);
        $awardedContractor = $this->getCustomerModel()->fetchCustomerById($project['awarded_contractor_id']);
        $items = $this->getItemModel()->fetchDataTables($project_id, 'project');
        $branches = $this->getP21LocationModel()->fetchAllBranches();

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

        $pdfContent = $this->getPdfExportService()->generatePdf('application/project/export', $data);

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
    }
}
