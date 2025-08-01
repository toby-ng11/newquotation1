<?php

namespace Application\Controller;

use Application\Model\Architect;
use Application\Model\Customer;
use Application\Model\Item;
use Application\Model\Location;
use Application\Model\MarketSegment;
use Application\Model\Note;
use Application\Model\Opportunity;
use Application\Model\Project;
use Application\Model\ProjectShare;
use Application\Model\Quote;
use Application\Model\RoleOverride;
use Application\Model\Specifier;
use Application\Model\Status;
use Application\Model\User;
use Application\Service\UserService;
use Laminas\Http\Request;
use Laminas\Http\Response;
use Laminas\Mvc\Controller\AbstractRestfulController;
use Laminas\View\Model\ViewModel;
use Mpdf\Tag\Address;
use Psr\Container\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * @method Request getRequest()
 * @method Response getResponse()
 */
abstract class BaseController extends AbstractRestfulController
{
    /**
     * Render 404 page
     *
     * @return void
     */
    protected function abort403()
    {
        return (new ViewModel())->setTemplate('error/permission');
    }

    /**
     * Render 403 page
     *
     * @return void
     */
    protected function abort404()
    {
        return (new ViewModel())->setTemplate('error/not-found');
    }

    protected ContainerInterface $container;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    public function getAddressModel(): Address
    {
        return $this->container->get(Address::class);
    }

    public function getArchitectModel(): Architect
    {
        return $this->container->get(Architect::class);
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

    public function getNoteModel(): Note
    {
        return $this->container->get(Note::class);
    }

    public function getOpportunityModel(): Opportunity
    {
        return $this->container->get(Opportunity::class);
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

    public function getUserService(): UserService
    {
        return $this->container->get(UserService::class);
    }

    protected function json($data, int $status = 200, array $headers = []): Response
    {
        $symfony = new JsonResponse($data, $status, $headers);

        $response = $this->getResponse();
        $response->setContent($symfony->getContent());
        foreach ($symfony->headers->allPreserveCase() as $name => $values) {
            foreach ($values as $value) {
                $response->getHeaders()->addHeaderLine($name, $value);
            }
        }
        $response->setStatusCode($symfony->getStatusCode());

        return $response;
    }
}
