<?php

namespace Application\Controller;

use Laminas\View\Model\ViewModel;
use Exception;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Psr\Container\ContainerInterface;

class ArchitectController extends BaseController
{
    public function __construct(ContainerInterface $container) {
        parent::__construct($container);
    }

    public function indexAction()
    {
        $request = $this->getRequest();

        if ($request->isXmlHttpRequest()) {
            $pattern = $this->params()->fromQuery('search', '');
            $user = $this->getUserService()->getCurrentUser();
            $admin = false;
            if ($user['p2q_system_role'] === 'admin' || $user['p2q_system_role'] === 'manager') {
                $admin = true;
            }

            if (empty($pattern)) {
                return $this->json(['error' => 'Pattern is required']);
            }

            $architect = $this->getArchitectModel()->fetchArchitectByPattern($admin, $pattern, $user['id']);

            return $this->json($architect);
        }

        return $this->abort404();
    }

    public function editAction()
    {
        $user = $this->getUserService()->getCurrentUser();

        if ($user['p2q_system_role'] === 'guest') {
            return $this->abort403();
        }

        $this->layout()->setTemplate('layout/default');
        $request = $this->getRequest(); // for submit edit form

        if ($request->isPost()) {
            $architect_id = (int) $this->params()->fromRoute('id');
            $data = $this->params()->fromPost();

            if (! $architect_id) {
                return $this->json([
                    'success' => false,
                    'message' => 'Missing required fields: Architect ID'
                ]);
            }

            $result = $this->getArchitectModel()->edit($data, $architect_id);

            if ($result) {
                return $this->json([
                    'success' => true,
                    'message' => 'Architect updated successfully!',
                ]);
            } else {
                return $this->json([
                    'success' => false,
                    'message' => 'Save failed. Please try again.',
                ]);
            }
        }

        $architect_id = (int) $this->params()->fromRoute('id');
        if (! $architect_id) {
            return $this->redirect()->toRoute('index', ['action' => 'architect']);
        }

        $architect = $this->getArchitectModel()->fetchArchitectById($architect_id);

        if (! $architect) {
            $this->flashMessenger()->addErrorMessage("This architect doesn't exist.");
            return $this->redirect()->toRoute('index', ['action' => 'architect']);
        }

        $location = $this->getP21LocationModel()->fetchAllBranches();
        $projectStatus = $this->getProjectModel()->fetchProjectStatus();
        $marketSegment = $this->getProjectModel()->fetchProjectSegment();

        $architectType = $this->getArchitectModel()->fetchArchitectType();
        $addressList = $this->getAddressModel()->fetchAddressesByArchitect($architect_id);
        $specifierList = $this->getSpecifierModel()->fetchSpecifiersByArchitect($architect_id);
        $company = $this->getP21LocationModel()->fetchAllCompanies();

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
                return $this->json(['success' => false, 'message' => 'Missing architect ID']);
            }

            try {
                $result = $this->getArchitectModel()->delete($architect_id);

                if ($result) {
                    $this->flashMessenger()->addSuccessMessage("Architect deleted!");
                    return $this->json([
                        'success' => true,
                    ]);
                } else {
                    return $this->json([
                        'success' => false,
                        'message' => 'Failed to delete architect.',
                    ]);
                }
            } catch (Exception $e) {
                return $this->json([
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
            $specifiers = $this->getSpecifierModel()->fetchSpecifiersByArchitect($architect_id);
            $view = $this->json($specifiers);
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
                return $this->json(['error' => 'ID is required']);
            }

            $architect = $this->getArchitectModel()->fetchArchitectById($id);

            return $this->json($architect);
        }
        return $this->abort404();
    }

    public function addressAction()
    {
        $request = $this->getRequest();
        if ($request->isXmlHttpRequest()) {
            $id = $this->params()->fromRoute('id', null);

            if (empty($id)) {
                return $this->json(['error' => 'ID is required']);
            }

            $address = $this->getAddressModel()->fetchAddressesByArchitect($id);

            return $this->json($address);
        }
        return $this->abort404();
    }

    public function addressinfoAction()
    {
        $request = $this->getRequest();
        if ($request->isXmlHttpRequest()) {
            $id = $this->params()->fromRoute('id', null);

            if (empty($id)) {
                return $this->json(['error' => 'ID is required']);
            }

            $address = $this->getAddressModel()->fetchAddressesById($id);

            return $this->json($address);
        }
        return $this->abort404();
    }

    public function specifiersAction()
    {
        $request = $this->getRequest();
        if ($request->isXmlHttpRequest()) {
            $id = $this->params()->fromRoute('id', null);

            if (empty($id)) {
                return $this->json(['error' => 'ID is required']);
            }

            $architect = $this->getSpecifierModel()->fetchSpecifiersByArchitect($id);

            return $this->json($architect);
        }
        return $this->abort404();
    }

    public function specinfoAction()
    {
        $request = $this->getRequest();
        if ($request->isXmlHttpRequest()) {
            $id = $this->params()->fromRoute('id', null);

            if (empty($id)) {
                return $this->json(['error' => 'ID is required']);
            }

            $architect = $this->getSpecifierModel()->fetchSpecifierById($id);

            return $this->json($architect);
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
            return $this->json(['error' => 'ID is required']);
        }

        $projects = $this->getArchitectModel()->fetchProjectsByArchitect($id, $selectedIDsArray);

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
            return $this->json($projects);
        }

        return $this->abort404();
    }
}
