<?php

namespace Application\Traits;

use Application\Model\Address;
use Application\Model\Architect;
use Application\Model\ArchitectType;
use Application\Model\Customer;
use Application\Model\Item;
use Application\Model\Location;
use Application\Model\MarketSegment;
use Application\Model\Opportunity;
use Application\Model\OpportunityShare;
use Application\Model\Project;
use Application\Model\ProjectNote;
use Application\Model\ProjectShare;
use Application\Model\Quote;
use Application\Model\RoleOverride;
use Application\Model\Specifier;
use Application\Model\Status;
use Application\Model\User;
use Application\Model\View\P21User;
use Application\Model\View\P2qViewOpportunitiesShare;
use Application\Model\View\P2qViewOpportunity;
use Application\Model\View\P2qViewQuote;
use Application\Model\View\P2qViewQuoteShare;
use Application\Service\PdfExportService;
use Application\Service\UserService;

trait HasModels
{
    public function getAddressModel(): Address
    {
        return $this->container->get(Address::class);
    }

    public function getArchitectModel(): Architect
    {
        return $this->container->get(Architect::class);
    }

    public function getArchitectTypeModel(): ArchitectType
    {
        return $this->container->get(ArchitectType::class);
    }

    public function getCustomerModel(): Customer
    {
        return $this->container->get(Customer::class);
    }

    public function getItemModel(): Item
    {
        return $this->container->get(Item::class);
    }

    public function getMarketSegmentModel(): MarketSegment
    {
        return $this->container->get(MarketSegment::class);
    }

    public function getNoteModel(): ProjectNote
    {
        return $this->container->get(ProjectNote::class);
    }

    public function getOpportunityModel(): Opportunity
    {
        return $this->container->get(Opportunity::class);
    }

    public function getOpportunityShareModel(): OpportunityShare
    {
        return $this->container->get(OpportunityShare::class);
    }

    public function getProjectModel(): Project
    {
        return $this->container->get(Project::class);
    }

    public function getProjectShareModel(): ProjectShare
    {
        return $this->container->get(ProjectShare::class);
    }

    public function getQuoteModel(): Quote
    {
        return $this->container->get(Quote::class);
    }

    public function getRoleOverrideModel(): RoleOverride
    {
        return $this->container->get(RoleOverride::class);
    }

    public function getSpecifierModel(): Specifier
    {
        return $this->container->get(Specifier::class);
    }

    public function getStatusModel(): Status
    {
        return $this->container->get(Status::class);
    }

    public function getUserModel(): User
    {
        return $this->container->get(User::class);
    }

    public function getP21LocationModel(): Location
    {
        return $this->container->get(Location::class);
    }

    public function getP21UserModel(): P21User
    {
        return $this->container->get(P21User::class);
    }

    public function getP2qViewOpportunityModel(): P2qViewOpportunity
    {
        return $this->container->get(P2qViewOpportunity::class);
    }

    public function getP2qViewOpportunitiesShareModel(): P2qViewOpportunitiesShare
    {
        return $this->container->get(P2qViewOpportunitiesShare::class);
    }

    public function getP2qViewQuoteModel(): P2qViewQuote
    {
        return $this->container->get(P2qViewQuote::class);
    }

    public function getP2qViewQuoteShareModel(): P2qViewQuoteShare
    {
        return $this->container->get(P2qViewQuoteShare::class);
    }

    public function getUserService(): UserService
    {
        return $this->container->get(UserService::class);
    }

    public function getPdfExportService(): PdfExportService
    {
        return $this->container->get(PdfExportService::class);
    }
}
