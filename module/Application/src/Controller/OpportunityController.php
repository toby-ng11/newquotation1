<?php

namespace Application\Controller;

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
    public function get($id)
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
    public function create($data)
    {
        $result = $this->getOpportunityModel()->create($data);
        return $this->json([
            'success' => $result !== false,
            'message' => $result ? 'Market segment added!' : 'Error! Please check log for more details.',
        ]);
    }

    // PUT /enpoint/:id
    public function update($data, $id)
    {
        $result = $this->getOpportunityModel()->update($data, $id);
        return $this->json([
            'success' => $result !== false,
            'message' => $result ? 'Saved successfully!' : 'Error! Please check log for more details.',
        ]);
    }

    // DELETE /enpoint/:id
    public function delete($id)
    {
        $result = $this->getOpportunityModel()->delete($id);
        return $this->json([
            'success' => $result !== false,
            'message' => $result ? 'Deleted successfully!' : 'Error! Please check log for more details.',
        ]);
    }

    public function viewAction()
    {
        $opportunity_id = (int) $this->params()->fromRoute('id');
        if (! $opportunity_id) {
            return $this->abort404();
        }

        $opportunity = $this->getOpportunityModel()->find($opportunity_id);
        if (! $opportunity || ($opportunity['deleted_at'])) {
            $this->flashMessenger()->addErrorMessage("This opportunity is deleted.");
            return $this->redirect()->toRoute('dashboard', ['action' => 'opportunities']);
        }

        $user = $this->getUserService()->getCurrentUser();
        $location = $this->getP21LocationModel()->fetchAllBranches();
        $company = $this->getP21LocationModel()->fetchAllCompanies();
        $status = $this->getStatusModel()->all();
        $marketSegment = $this->getMarketSegmentModel()->all();
        $architect = $this->getArchitectModel()->fetchArchitectById($opportunity['architect_id']);
        $address = $this->getAddressModel()->fetchAddressesById($opportunity['architect_address_id']);
        $specifier = $this->getSpecifierModel()->fetchSpecifierById($opportunity['specifier_id']);
        $specifierAddress = null;
        if ($specifier) {
            $specifierAddress = $this->getAddressModel()->fetchSpecifierAddress($specifier['id']);
        }

        $architectType = $this->getArchitectModel()->fetchArchitectType();
        $addressList = $this->getAddressModel()->fetchAddressesByArchitect($opportunity['architect_id']);
        $specifierList = $this->getSpecifierModel()->fetchSpecifiersByArchitect($opportunity['architect_id']);
        $generalContractor = $this->getCustomerModel()->fetchCustomerById($opportunity['general_contractor_id']);
        $awardedContractor = $this->getCustomerModel()->fetchCustomerById($opportunity['awarded_contractor_id']);

        $this->layout()->setVariable('id', $opportunity_id); //for sidebar

        $owner = false;

        $isShareExists = $this->projectShare->isShareExists($opportunity_id, $user['id']);

        if (
            $isShareExists ||
            $user['id'] === $opportunity['owner_id'] ||
            $user['p2q_system_role'] === 'admin' ||
            $user['p2q_system_role'] === 'manager'
        ) {
            $owner = true;
        }

        $admin = false;
        if ($user['p2q_system_role'] === 'admin' || $user['p2q_system_role'] === 'manager') {
            $admin = true;
        }

        return new ViewModel([
            'id' => $project_id,
            'user' => $user,
            'opportunity' => $opportunity,
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
}
