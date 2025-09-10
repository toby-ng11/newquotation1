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

        return $this->json([
            'success' => true,
            'opportinity' => $row,
        ]);
    }

    // POST /enpoint
    public function create(mixed $data)
    {
        $result = $this->getOpportunityModel()->create($data);
        return $this->json([
            'success' => $result !== false,
            'message' => $result !== false ? 'Opportunity created!' : 'Error! Please check log for more details.',
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
        $result = $this->getOpportunityModel()->delete($id);
        return $this->json([
            'success' => $result !== false,
            'message' => $result !== false ? 'Deleted successfully!' : 'Error! Please check log for more details.',
        ]);
    }

    public function editAction(): Response | ViewModel
    {
        $this->layout()->setTemplate('layout/default');
        $opportunity_id = (int) $this->params()->fromRoute('id');
        if (! $opportunity_id) {
            return $this->abort404();
        }

        $opportunity = $this->getOpportunityModel()->find($opportunity_id);
        if (! $opportunity ) {
            $this->flashMessenger()->addErrorMessage("This opportunity is deleted.");
            return $this->redirect()->toRoute('dashboard', ['action' => 'opportunities']);
        }

        $user = $this->getUserService()->getCurrentUser();
        $specifier = $this->getSpecifierModel()->fetchSpecifierById($opportunity['specifier_id']);
        $specifierAddress = null;
        if ($specifier) {
            $specifierAddress = $this->getAddressModel()->fetchSpecifierAddress($specifier['id']);
        }

        $isOwner = false;

        $isShareExists = $this->getOpportunityShareModel()->findBy([
            'opportunity_id' => $opportunity_id,
            'shared_user' => $user['id'],
        ]);

        if (
            $isShareExists ||
            $user['id'] === $opportunity['created_by'] ||
            $user['p2q_system_role'] === 'admin' ||
            $user['p2q_system_role'] === 'manager'
        ) {
            $isOwner = true;
        }

        return new ViewModel([
            'user' => $user,
            'defaultCompany' => Defaults::company(),
            'opportunity' => $opportunity,
            'locations' => $this->getP21LocationModel()->fetchAllBranches(),
            'companies' => $this->getP21LocationModel()->fetchAllCompanies(),
            'projectStatuses' => $this->getStatusModel()->findBy(['project_flag' => 'Y']),
            'marketSegments' => $this->getMarketSegmentModel()->all(),
            'isOwner' => $isOwner,
            'architect' => $this->getArchitectModel()->fetchArchitectById($opportunity['architect_id']),
            'address' => $this->getAddressModel()->fetchAddressesById($opportunity['architect_address_id']),
            'specifier' => $specifier,
            'specifierAddress' => $specifierAddress,
            'architectTypes' => $this->getArchitectTypeModel()->all(),
            'specifierList' => $this->getSpecifierModel()->fetchSpecifiersByArchitect($opportunity['architect_id']),
            'addressList' => $this->getAddressModel()->fetchAddressesByArchitect($opportunity['architect_id']),
            'generalContractor' => $this->getCustomerModel()->fetchCustomerById($opportunity['general_contractor_id']),
            'awardedContractor' => $this->getCustomerModel()->fetchCustomerById($opportunity['awarded_contractor_id']),
        ]);
    }

    public function sharedAction()
    {
        $opportunity_id = (int) $this->params()->fromRoute('id');
        $table = $this->getOpportunityShareModel()->find($opportunity_id);
        return $this->json($table);
    }
}
