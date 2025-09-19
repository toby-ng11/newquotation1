<?php

namespace Application\Controller;

use Application\Config\Defaults;
use Laminas\Http\Response;
use Laminas\View\Model\ViewModel;
use Psr\Container\ContainerInterface;

class OpportunityController extends BaseController
{
    public function __construct(ContainerInterface $container)
    {
        parent::__construct($container);
    }

    // GET /enpoint
    public function getList()
    {
        $table = $this->getOpportunityModel()->all();
        return $this->json([
            'success' => true,
            'data' => iterator_to_array($table),
        ]);
    }

    // GET /enpoint/:id
    public function get(mixed $id)
    {
        $row = $this->getOpportunityModel()->find($id);
        if (! $row) {
            return $this->abort404();
        }

        $request = $this->getRequest();
        if (! $this->expectsJson($request)) {
            return $this->redirect()->toRoute('opportunities/new', [
                'action' => 'edit',
                'id' => $id
            ]);
        }

        return $this->json([
            'success' => true,
            'opportinity' => $row,
        ]);
    }

    // POST /enpoint
    public function create(mixed $data)
    {
        $request = $this->getRequest();
        $opportunityId = (int) $this->params()->fromQuery('opp', null);

        if ($opportunityId) {
            $result = $this->getOpportunityModel()->update($opportunityId, $data);

            $project = $this->getProjectModel()->fetchByOpportunity($opportunityId); // also update project if any
            if (! empty($project)) {
                $updatedOpportunity = $this->getOpportunityModel()->find($opportunityId); // get a fresh opportunity
                $updateProject = $this->getProjectModel()->saveFromOpportunity($updatedOpportunity);
                $updateProjectResult = $updateProject ? true : false;
            } else {
                $updateProjectResult = true;
            }

            if ($this->expectsJson($request)) {
                return $this->json([
                    'success' => ($result && $updateProjectResult) !== false,
                    'message' => ($result && $updateProjectResult) ? 'Saved successfully!' : 'Error! Please check log for more details.',
                ]);
            } else {
                if ($result && $updateProjectResult) {
                    $this->flashMessenger()->addSuccessMessage("Opportunity saved successfully!");
                } else {
                    $this->flashMessenger()->addErrorMessage("Opportunity saved failed! Please contact admin to solve this problem.");
                }

                return $this->redirect()->toRoute('opportunities/new', [
                    'action' => 'edit',
                    'id' => $opportunityId
                ]);
            }
        }

        $result = $this->getOpportunityModel()->create($data);

        $result !== false ?
            $this->flashMessenger()->addSuccessMessage("Opportunity saved successfully!") :
            $this->flashMessenger()->addErrorMessage("Opportunity saved failed! Please contact admin to solve this problem.");

        return $this->json([
            'success' => $result !== false,
            'message' => $result !== false ? 'Opportunity created!' : 'Error! Please check log for more details.',
            'opportunity_id' => $result,
        ]);
    }

    // PUT /enpoint/:id
    public function update(mixed $id, mixed $data)
    {
        $result = $this->getOpportunityModel()->update($id, $data);
        return $this->json([
            'success' => $result !== false,
            'message' => $result ? 'Saved successfully!' : 'Error! Please check log for more details.',
        ]);
    }

    // DELETE /enpoint/:id
    public function delete(mixed $id)
    {
        $project = $this->getProjectModel()->fetchByOpportunity($id);

        if ($project) $this->getProjectModel()->delete($project['id']);

        $uploadDir = realpath(__DIR__ . '/../../../../data/uploads/opportunity/' . $id);
        if ($uploadDir !== false && is_dir($uploadDir)) {
            $this->deleteDirectory($uploadDir);
        }

        $result = $this->getOpportunityModel()->delete($id);

        $result
            ? $this->flashMessenger()->addSuccessMessage("Opportunity deleted!")
            : $this->flashMessenger()->addErrorMessage("Delete failed! Please contact admin.");

        return $this->json([
            'success' => $result !== false,
            'message' => $result !== false
                ? 'Deleted successfully!'
                : 'Error! Please check log for more details.',
        ]);
    }

    private function deleteDirectory(string $dir): void
    {
        $items = scandir($dir);
        foreach ($items as $item) {
            if ($item === '.' || $item === '..') {
                continue;
            }
            $path = $dir . DIRECTORY_SEPARATOR . $item;
            if (is_dir($path)) {
                $this->deleteDirectory($path);
            } else {
                @unlink($path);
            }
        }
        @rmdir($dir);
    }

    public function editAction(): Response | ViewModel
    {
        $user = $this->getUserService()->getCurrentUser();

        if ($user['p2q_system_role'] === 'guest') {
            return $this->abort403();
        }

        $opportunity_id = (int) $this->params()->fromRoute('id');
        if (! $opportunity_id) {
            return $this->abort404();
        }

        $opportunity = $this->getOpportunityModel()->find($opportunity_id);
        if (! $opportunity) {
            $this->flashMessenger()->addErrorMessage("This opportunity is deleted.");
            return $this->redirect()->toRoute('dashboard', ['action' => 'opportunities']);
        }

        $shareRecord  = $this->getOpportunityShareModel()->where([
            'opportunity_id' => $opportunity_id,
            'shared_user' => $user['id'],
        ]);

        $canSee = (
            $user['id'] === $opportunity['created_by'] ||
            in_array($user['p2q_system_role'], ['admin', 'manager'], true) ||
            !empty($shareRecord)
        );

        if (!$canSee) {
            return $this->abort403();
        }

        $sharedRole = $shareRecord[0]['role'] ?? null;

        $canEdit = (
            $sharedRole === 'editor' ||
            $user['id'] === $opportunity['created_by'] ||
            in_array($user['p2q_system_role'], ['admin', 'manager'], true)
        );

        $specifier = $this->getSpecifierModel()->fetchSpecifierById($opportunity['specifier_id']);
        $specifierAddress = null;
        if ($specifier) {
            $specifierAddress = $this->getAddressModel()->fetchSpecifierAddress($specifier['id']);
        }

        $project = $this->getProjectModel()->fetchByOpportunity($opportunity_id);

        $this->layout()->setTemplate('layout/default');
        return new ViewModel([
            'user' => $user,
            'defaultCompany' => Defaults::company(),
            'canEdit' => $canEdit,
            'opportunity' => $opportunity,
            'project' => ! empty($project) ? $project : null,
            'isConverted' => ! empty($project) ? true : false,
            'locations' => $this->getP21LocationModel()->fetchAllBranches(),
            'companies' => $this->getP21LocationModel()->fetchAllCompanies(),
            'projectStatuses' => $this->getStatusModel()->where(['project_flag' => 'Y']),
            'marketSegments' => $this->getMarketSegmentModel()->all(),
            'architect' => $this->getArchitectModel()->fetchArchitectById($opportunity['architect_id']),
            'address' => $this->getAddressModel()->fetchAddressesById($opportunity['architect_address_id']),
            'specifier' => $specifier,
            'specifierAddress' => $specifierAddress,
            'architectTypes' => $this->getArchitectTypeModel()->all(),
            'specifierList' => $this->getSpecifierModel()->fetchSpecifiersByArchitect($opportunity['architect_id']),
            'addressList' => $this->getAddressModel()->fetchAddressesByArchitect($opportunity['architect_id']),
            'generalContractor' => ! empty($project) ? $this->getCustomerModel()->fetchCustomerById($project['general_contractor_id']) : null,
            'awardedContractor' => ! empty($project) ? $this->getCustomerModel()->fetchCustomerById($project['awarded_contractor_id']) : null,
        ]);
    }

    public function convertAction(): Response | ViewModel
    {
        $request = $this->getRequest();
        if (! $this->expectsJson($request) || ! $request->isPost()) {
            return $this->abort404();
        }

        $opportunityId = (int) $this->params()->fromRoute('id');
        $opportunity = $this->getOpportunityModel()->find($opportunityId);
        $result = $this->getProjectModel()->saveFromOpportunity($opportunity);

        if ($result) {
            $this->flashMessenger()->addSuccessMessage("Convert successfully! New project ID: $result");
            return $this->json([
                'success' => true,
                'message' => 'Project created successfully.',
                'project_id' => $result,
            ]);
        } else {
            return $this->json([
                'success' => false,
                'message' => 'Convert failed. Please contact admin to solve this problem.',
            ]);
        }
    }
}
