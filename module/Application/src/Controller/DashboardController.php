<?php

namespace Application\Controller;

use Laminas\Http\Response;
use Laminas\View\Model\ViewModel;
use Psr\Container\ContainerInterface;

class DashboardController extends BaseController
{
    public function __construct(ContainerInterface $container)
    {
        parent::__construct($container);
    }

    public function homeAction(): Response | ViewModel
    {
        return $this->render('dashboards/home');
    }

    public function adminAction(): Response | ViewModel
    {
        return $this->render('dashboards/admin');
    }

    public function adminProjectsAction(): Response
    {
        $useView = $this->params()->fromQuery('view', false);
        $projects = $useView ? $this->getProjectModel()->fetchAllViews() : $this->getProjectModel()->fetchAll();
        $view = $this->json($projects);
        return $view;
    }

    public function opportunityAction(): Response | ViewModel
    {
        return $this->render('dashboards/opportunity');
    }

    public function opportunityOpportunitiesAction(): Response
    {
        $user = $this->getUserService()->getCurrentUser();
        $opportunities = $this->getP2qViewOpportunityModel()->where(['created_by' => $user['id']]);
        return $this->json($opportunities);
    }

    public function opportunitySharedOpportunitiesAction(): Response
    {
        $user = $this->getUserService()->getCurrentUser();
        $opportunities = $this->getP2qViewOpportunitiesShareModel()->where(['shared_user' => $user['id']]);
        return $this->json($opportunities);
    }

    public function opportunityOtherOpportunitiesAction(): Response
    {
        $user = $this->getUserService()->getCurrentUser();
        $opportunities = $this->getP2qViewOpportunityModel()->where(['created_by != ?' => $user['id']]);
        return $this->json($opportunities);
    }

    public function projectAction(): Response | ViewModel
    {
        return $this->render('dashboards/project');
    }

    public function quoteAction(): Response | ViewModel
    {
        return $this->render('dashboards/quote');
    }

    public function ownQuotesAction(): Response
    {
        $user = $this->getUserService()->getCurrentUser();
        $quotes = $this->getP2qViewQuoteModel()->where(['created_by' => $user['id']]);
        return $this->json($quotes);
    }

    public function sharedQuotesAction(): Response
    {
        $user = $this->getUserService()->getCurrentUser();
        $quotes = $this->getP2qViewQuoteShareModel()->where(['shared_user' => $user['id']]);
        return $this->json($quotes);
    }

    public function architectAction(): Response | ViewModel
    {
        return $this->render('dashboards/architect');
    }

    public function quoteditemsAction(): Response | ViewModel
    {
        return $this->render('dashboards/quoted-items');
    }

    public function itemsQuotedItemsAction(): Response
    {
        $quotes = $this->getItemModel()->fetchItemQuoteTable();
        return $this->json($quotes);
    }
}
