<?php

declare(strict_types=1);

namespace Application\Controller;

use Application\Config\Defaults;
use Laminas\View\Model\ViewModel;
use Laminas\Http\Response;
use Psr\Container\ContainerInterface;

class IndexController extends BaseController
{
    public function __construct(ContainerInterface $container)
    {
        parent::__construct($container);
    }

    public function indexAction(): Response | ViewModel
    {
        return $this->render('welcome');
    }

    public function adminAction(): ViewModel | Response
    {
        $user = $this->getUserService()->getCurrentUser();
        if ($user['p2q_system_role'] !== 'admin') {
            return $this->abort403();
        }

        $this->layout()->setTemplate('layout/default');

        $table = $this->params()->fromRoute('table', 'project'); // default to project
        $location = null;

        if ($this->getRequest()->isXmlHttpRequest()) {
            switch ($table) {
                case 'project':
                    $useView = $this->params()->fromQuery('view', false);
                    $projects = $useView ? $this->getProjectModel()->fetchAllViews() : $this->getProjectModel()->fetchAll();
                    $view = $this->json($projects);
                    return $view;
                case 'quote':
                    $useView = $this->params()->fromQuery('view', false);
                    $quotes = $useView ? $this->getQuoteModel()->fetchAllViews($location) : $this->getQuoteModel()->fetchAll();
                    $view = $this->json($quotes);
                    return $view;
                case 'roleoverride':
                    $setRole = $this->getRoleOverrideModel()->all();
                    return $this->json($setRole);
                case 'users':
                    $setRole = $this->getP21UserModel()->all();
                    return $this->json($setRole);
                case 'market-segment':
                    $setRole = $this->getMarketSegmentModel()->all();
                    return $this->json($setRole);
                case 'statuses':
                    $setRole = $this->getStatusModel()->all();
                    return $this->json($setRole);
            }
        }

        $viewModel = new ViewModel([
            'user' => $this->getUserService()->getCurrentUser(),
        ]);

        // If HTMX request, skip layout
        if ($this->getRequest()->getHeader('HX-Request')) {
            $viewModel->setTerminal(true);
        }

        return $viewModel;
    }

    public function projectAction(): ViewModel | Response
    {
        $user = $this->getUserService()->getCurrentUser();

        if ($user['p2q_system_role'] === 'guest') {
            return $this->abort403();
        }

        $this->layout()->setTemplate('layout/default');

        $table = $this->params()->fromRoute('table', 'own');

        if ($this->getRequest()->isXmlHttpRequest()) {
            switch ($table) {
                case 'own':
                    $TableView = $this->getProjectModel()->fetchOwnProjects($user['id']);
                    return $this->json($TableView);
                case 'assigned':
                    $TableView = $this->getProjectModel()->fetchAssignedProjects($user['id']);
                    return $this->json($TableView);
                case 'other':
                    $TableView = $this->getProjectModel()->fetchOtherUsersProjects($user['id']);
                    return $this->json($TableView);
                case 'quote':
                    $TableView = $this->getQuoteModel()->fetchOwnQuotes($user['id']);
                    return $this->json($TableView);
                case 'note':
                    $TableView = $this->getNoteModel()->fetchOwnNotes($user['id']);
                    return $this->json($TableView);
            }
        }

        $viewModel = new ViewModel([
            'user' => $user,
        ]);

        // If HTMX request, skip layout
        if ($this->getRequest()->getHeader('HX-Request')) {
            $viewModel->setTerminal(true);
        }

        return $viewModel;
    }

    public function approvalAction(): ViewModel | Response
    {
        $user = $this->getUserService()->getCurrentUser();

        if ($user['p2q_system_role'] === 'guest' || $user['p2q_system_role'] === 'sales') {
            return $this->abort403();
        }

        $this->layout()->setTemplate('layout/default');

        $table = $this->params()->fromRoute('table', 'approved');
        $waitingTableCount = $this->getQuoteModel()->countApproval($this->getQuoteModel()::WAITING_APPROVAL);
        $approvedTableCount = $this->getQuoteModel()->countApproval($this->getQuoteModel()::APPROVED);
        $disapprovedTableCount = $this->getQuoteModel()->countApproval($this->getQuoteModel()::DISAPPROVED);

        if ($this->getRequest()->isXmlHttpRequest()) {
            switch ($table) {
                case 'waiting':
                    $TableView = $this->getQuoteModel()->fetchApprovalTable($this->getQuoteModel()::WAITING_APPROVAL);
                    return $this->json($TableView);
                case 'approved':
                    $TableView = $this->getQuoteModel()->fetchApprovalTable($this->getQuoteModel()::APPROVED);
                    return $this->json($TableView);
                case 'disapproved':
                    $TableView = $this->getQuoteModel()->fetchApprovalTable($this->getQuoteModel()::DISAPPROVED);
                    return $this->json($TableView);
            }
        }

        $viewModel = new ViewModel([
            'user' => $user,
            'waitingTableCount' => $waitingTableCount,
            'approvedTableCount' => $approvedTableCount,
            'disapprovedTableCount' => $disapprovedTableCount
        ]);

        // If HTMX request, skip layout
        if ($this->getRequest()->getHeader('HX-Request')) {
            $viewModel->setTerminal(true);
        }

        return $viewModel;
    }

    public function architectAction(): ViewModel | Response
    {
        $user = $this->getUserService()->getCurrentUser();

        if ($user['p2q_system_role'] === 'guest') {
            return $this->abort403();
        }

        $this->layout()->setTemplate('layout/default');

        $table = $this->params()->fromRoute('table', 'all');

        $admin = false;
        if ($user['p2q_system_role'] === 'admin' || $user['p2q_system_role'] === 'manager') {
            $admin = true;
        }

        if ($this->getRequest()->isXmlHttpRequest()) {
            switch ($table) {
                case 'all':
                    $TableView = $this->getArchitectModel()->fetchAllTable($admin, $user['id']);
                    return $this->json($TableView);
                case 'topfive':
                    $TableView = $this->getArchitectModel()->fetchTopFiveTable($user['id']);
                    return $this->json($TableView);
            }
        }

        $viewModel = new ViewModel([
            'user' => $user,
            'totalArchitects' => $this->getArchitectModel()->countAllArchitects($admin, $user['id']),
            'totalCompleteProjects' => $this->getProjectModel()->countAllCompleteProjects($admin, $user['id']),
            'totalActiveProjects' => $this->getProjectModel()->countActiveProjects($admin, $user['id']),
        ]);

        // If HTMX request, skip layout
        if ($this->getRequest()->getHeader('HX-Request')) {
            $viewModel->setTerminal(true);
        }

        return $viewModel;
    }

    public function opportunitiesAction(): Response | ViewModel
    {
        $user = $this->getUserService()->getCurrentUser();

        if ($user['p2q_system_role'] === 'guest') {
            return $this->abort403();
        }

        $this->layout()->setTemplate('layout/default');

        $viewModel = new ViewModel([
            'user' => $user,
            'locations' => $this->getP21LocationModel()->fetchAllBranches(),
            'companies' => $this->getP21LocationModel()->fetchAllCompanies(),
            'projectStatus' => $this->getStatusModel()->findBy(['project_flag' => 'Y']),
            'marketSegment' => $this->getMarketSegmentModel()->all(),
            'architectTypes' => $this->getArchitectTypeModel()->all(),
            'defaultLocationId' => Defaults::locationId(),
            'defaultCompany' => Defaults::company(),
        ]);

        if ($this->getRequest()->getHeader('HX-Request')) {
            $viewModel->setTerminal(true);
        }

        return $viewModel;
    }

    public function quotesAction(): Response | ViewModel
    {
        $user = $this->getUserService()->getCurrentUser();
        if ($user['p2q_system_role'] === 'guest') {
            return $this->abort403();
        }

        $this->layout()->setTemplate('layout/default');
        $viewModel = new ViewModel([
            'user' => $user,
        ]);

        if ($this->getRequest()->getHeader('HX-Request')) {
            $viewModel->setTerminal(true);
        }

        return $viewModel;
    }
}
