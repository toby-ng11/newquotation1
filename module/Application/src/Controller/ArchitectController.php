<?php

namespace Application\Controller;

use Laminas\View\Model\{ViewModel, JsonModel};
use Application\Model\{Architect, Specifier, Address, Location, Project};
use Application\Service\UserService;
use Exception;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class ArchitectController extends BaseController
{
    protected $userService;
    protected $architect;
    protected $specifier;
    protected $address;
    protected $location;
    protected $project;

    public function __construct(
        UserService $userService,
        Architect $architect,
        Address $address,
        Specifier $specifier,
        Location $location,
        Project $project
    ) {
        $this->userService = $userService;
        $this->architect = $architect;
        $this->address = $address;
        $this->specifier = $specifier;
        $this->location = $location;
        $this->project = $project;
    }

    public function indexAction()
    {
        $request = $this->getRequest();

        if ($request->isXmlHttpRequest()) {
            $pattern = $this->params()->fromQuery('search', '');
            $user = $this->userService->getCurrentUser();
            $admin = false;
            if ($user['p2q_system_role'] === 'admin' || $user['p2q_system_role'] === 'manager') {
                $admin = true;
            }

            if (empty($pattern)) {
                return new JsonModel(['error' => 'Pattern is required']);
            }

            $architect = $this->architect->fetchArchitectByPattern($admin, $pattern, $user['id']);

            return new JsonModel($architect);
        }

        return $this->abort404();
    }

    public function editAction()
    {
        $request = $this->getRequest(); // for submit edit form

        if ($request->isPost()) {
            $architect_id = (int) $this->params()->fromRoute('id');
            $data = $this->params()->fromPost();

            if (! $architect_id) {
                return new JsonModel([
                    'success' => false,
                    'message' => 'Missing required fields: Architect ID'
                ]);
            }

            $result = $this->architect->edit($data, $architect_id);

            if ($result) {
                return new JsonModel([
                    'success' => true,
                    'message' => 'Architect updated successfully!',
                ]);
            } else {
                return new JsonModel([
                    'success' => false,
                    'message' => 'Save failed. Please try again.',
                ]);
            }
        }

        $architect_id = (int) $this->params()->fromRoute('id');
        if (! $architect_id) {
            return $this->redirect()->toRoute('dashboard', ['action' => 'architect']);
        }

        $architect = $this->architect->fetchArchitectById($architect_id);

        if (! $architect) {
            $this->flashMessenger()->addErrorMessage("This architect doesn't exist.");
            return $this->redirect()->toRoute('dashboard', ['action' => 'architect']);
        }

        $user = $this->userService->getCurrentUser();
        $location = $this->location->fetchAllBranches();
        $projectStatus = $this->project->fetchProjectStatus();
        $marketSegment = $this->project->fetchProjectSegment();

        $architectType = $this->architect->fetchArchitectType();
        $addressList = $this->address->fetchAddressesByArchitect($architect_id);
        $specifierList = $this->specifier->fetchSpecifiersByArchitect($architect_id);
        $company = $this->location->fetchAllCompanies();

        return new ViewModel([
            'id' => $architect_id,
            'user' => $user,
            'locations' => $location,
            'projectStatus' => $projectStatus,
            'marketSegment' => $marketSegment,
            'architect' => $architect,
            'architectType' => $architectType,
            'company' => $company,
            'addressList' => $addressList,
            'specifierList' => $specifierList,
        ]);
    }

    public function deleteAction()
    {
        $request = $this->getRequest();
        if ($request->isXmlHttpRequest()) {

            $architect_id = (int) $this->params()->fromRoute('id');

            if (! $architect_id) {
                return new JsonModel(['success' => false, 'message' => 'Missing architect ID']);
            }

            try {
                $result = $this->architect->delete($architect_id);

                if ($result) {
                    $this->flashMessenger()->addSuccessMessage("Architect deleted!");
                    return new JsonModel([
                        'success' => true,
                    ]);
                } else {
                    return new JsonModel([
                        'success' => false,
                        'message' => 'Failed to delete architect.',
                    ]);
                }
            } catch (Exception $e) {
                return new JsonModel([
                    'success' => false,
                    'message' => 'Failed to delete architect.',
                    'error' => $e->getMessage()
                ]);
            }
        }
        return $this->abort404();
    }

    public function specifierstableAction()
    {
        $request = $this->getRequest();
        if ($request->isXmlHttpRequest()) {
            $architect_id = $this->params()->fromRoute('id');
            $specifiers = $this->specifier->fetchSpecifiersByArchitect($architect_id);
            $view = new JsonModel($specifiers);
            return $view;
        }
        return $this->abort404();
    }

    public function fetchfullAction()
    {
        $request = $this->getRequest();
        if ($request->isXmlHttpRequest()) {
            $id = $this->params()->fromRoute('id', null);

            if (empty($id)) {
                return new JsonModel(['error' => 'ID is required']);
            }

            $architect = $this->architect->fetchArchitectById($id);

            return new JsonModel($architect);
        }
        return $this->abort404();
    }

    public function addressAction()
    {
        $request = $this->getRequest();
        if ($request->isXmlHttpRequest()) {
            $id = $this->params()->fromRoute('id', null);

            if (empty($id)) {
                return new JsonModel(['error' => 'ID is required']);
            }

            $address = $this->address->fetchAddressesByArchitect($id);

            return new JsonModel($address);
        }
        return $this->abort404();
    }

    public function addressinfoAction()
    {
        $request = $this->getRequest();
        if ($request->isXmlHttpRequest()) {
            $id = $this->params()->fromRoute('id', null);

            if (empty($id)) {
                return new JsonModel(['error' => 'ID is required']);
            }

            $address = $this->address->fetchAddressesById($id);

            return new JsonModel($address);
        }
        return $this->abort404();
    }

    public function specifiersAction()
    {
        $request = $this->getRequest();
        if ($request->isXmlHttpRequest()) {
            $id = $this->params()->fromRoute('id', null);

            if (empty($id)) {
                return new JsonModel(['error' => 'ID is required']);
            }

            $architect = $this->specifier->fetchSpecifiersByArchitect($id);

            return new JsonModel($architect);
        }
        return $this->abort404();
    }

    public function specinfoAction()
    {
        $request = $this->getRequest();
        if ($request->isXmlHttpRequest()) {
            $id = $this->params()->fromRoute('id', null);

            if (empty($id)) {
                return new JsonModel(['error' => 'ID is required']);
            }

            $architect = $this->specifier->fetchSpecifierById($id);

            return new JsonModel($architect);
        }
        return $this->abort404();
    }

    public function projectsAction()
    {
        $id = $this->params()->fromRoute('id', null);
        $isExport = $this->params()->fromQuery('export', null);

        $selectedIDs = $this->params()->fromQuery('ids');
        $selectedIDsArray = $selectedIDs ? explode(',', $selectedIDs) : null;

        if (empty($id)) {
            return new JsonModel(['error' => 'ID is required']);
        }

        $projects = $this->architect->fetchProjectsByArchitect($id, $selectedIDsArray);

        if ($isExport === 'excel') {
            $spreadsheet = new Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();

            // Header
            $sheet->fromArray(
                [
                    'Project ID',
                    'Project Name',
                    'Status',
                    'Location',
                    'Centura Location',
                    'Segment',
                    'Owner',
                    'Shared',
                    'REED ID',
                    'Due Date',
                    'Required Date',
                    'General Contractor ID',
                    'General Contractor',
                    'Awarded Contractor ID',
                    'General Contractor',
                ],
                null,
                'A1'
            );

            // Rows
            $row = 2;
            foreach ($projects as $project) {
                $sheet->setCellValue("A{$row}", $project['id']);
                $sheet->setCellValue("B{$row}", $project['project_name']);
                $sheet->setCellValue("C{$row}", $project['status_desc']);
                $sheet->setCellValue("D{$row}", $project['project_address']);
                $sheet->setCellValue("E{$row}", $project['centura_location_id']);
                $sheet->setCellValue("F{$row}", $project['market_segment_desc']);
                $sheet->setCellValue("G{$row}", $project['owner_name']);
                $sheet->setCellValue("H{$row}", $project['shared_name']);
                $sheet->setCellValue("I{$row}", $project['reed']);
                $sheet->setCellValue("J{$row}", $project['due_date']->format('Y-m-d'));
                $sheet->setCellValue("K{$row}", $project['require_date']->format('Y-m-d'));
                $sheet->setCellValue("L{$row}", $project['general_contractor_id']);
                $sheet->setCellValue("M{$row}", $project['gcontractor_name']);
                $sheet->setCellValue("N{$row}", $project['awarded_contractor_id']);
                $sheet->setCellValue("O{$row}", $project['acontractor_name']);
                $row++;
            }

            $columnCount = $sheet->getHighestColumn(); // 'C', 'D', etc.
            $columnIndex = Coordinate::columnIndexFromString($columnCount);

            for ($col = 1; $col <= $columnIndex; $col++) {
                $sheet->getColumnDimensionByColumn($col)->setAutoSize(true);
            }

            $writer = new Xlsx($spreadsheet);
            $filename = "architect_{$id}_projects_" . date('Y-m-d') . ".xlsx";

            $response = $this->getResponse();
            $headers = $response->getHeaders();
            $headers->addHeaderLine(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            );
            $headers->addHeaderLine('Content-Disposition', 'attachment; filename="' . $filename . '"');
            $headers->addHeaderLine('Cache-Control', 'max-age=0');

            ob_start();
            $writer->save('php://output');
            $excelOutput = ob_get_clean();

            $response->setContent($excelOutput);
            return $response;
        }

        if ($this->getRequest()->isXmlHttpRequest()) {
            return new JsonModel($projects);
        }

        return $this->abort404();
    }
}
