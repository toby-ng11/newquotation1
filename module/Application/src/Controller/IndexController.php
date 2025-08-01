<?php

declare(strict_types=1);

namespace Application\Controller;

use Laminas\View\Model\ViewModel;
use Application\Service\UserService;
use Application\Model\{
    Architect,
    Item,
    Location,
    MarketSegment,
    Project,
    Quote,
    Note,
    ProjectNote,
    RoleOverride,
    Status
};
use Application\Model\View\P21User;
use Psr\Container\ContainerInterface;

class IndexController extends BaseController
{
    protected $userService;
    protected $project;
    protected $quote;
    protected $note;
    protected $architect;

    public function __construct(
        UserService $userService,
        Project $project,
        Quote $quote,
        ProjectNote $note,
        Architect $architect,
        ContainerInterface $container
    ) {
        $this->userService = $userService;
        $this->project = $project;
        $this->quote = $quote;
        $this->note = $note;
        $this->architect = $architect;
        parent::__construct($container);
    }

    public function indexAction()
    {
        $user = $this->userService->getCurrentUser();
        $this->layout()->setTemplate('layout/nonheader');
        return new ViewModel([
            'user' => $user
        ]);
    }

    public function adminAction()
    {
        $user = $this->userService->getCurrentUser();

        if ($user['p2q_system_role'] !== 'admin') {
            $view = new ViewModel();
            $view->setTemplate('error/permission');
            return $view;
        }

        $table = $this->params()->fromRoute('table', 'project'); // default to project
        $location = null;

        if ($this->getRequest()->isXmlHttpRequest()) {
            switch ($table) {
                case 'project':
                    $useView = $this->params()->fromQuery('view', false);
                    $projects = $useView ? $this->project->fetchAllViews() : $this->project->fetchAll();
                    $view = $this->json($projects);
                    return $view;
                case 'quote':
                    $useView = $this->params()->fromQuery('view', false);
                    $quotes = $useView ? $this->quote->fetchAllViews($location) : $this->quote->fetchAll();
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
            'user' => $this->userService->getCurrentUser(),
        ]);

        // If HTMX request, skip layout
        if ($this->getRequest()->getHeader('HX-Request')) {
            $viewModel->setTerminal(true);
        }

        return $viewModel;
    }

    public function projectAction()
    {
        $user = $this->userService->getCurrentUser();

        if ($user['p2q_system_role'] === 'guest') {
            $view = new ViewModel();
            $view->setTemplate('error/permission');
            return $view;
        }

        $table = $this->params()->fromRoute('table', 'own');

        if ($this->getRequest()->isXmlHttpRequest()) {
            switch ($table) {
                case 'own':
                    $TableView = $this->project->fetchOwnProjects($user['id']);
                    return $this->json($TableView);
                case 'assigned':
                    $TableView = $this->project->fetchAssignedProjects($user['id']);
                    return $this->json($TableView);
                case 'other':
                    $TableView = $this->project->fetchOtherUsersProjects($user['id']);
                    return $this->json($TableView);
                case 'quote':
                    $TableView = $this->quote->fetchOwnQuotes($user['id']);
                    return $this->json($TableView);
                case 'note':
                    $TableView = $this->note->fetchOwnNotes($user['id']);
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

    public function approvalAction()
    {
        $user = $this->userService->getCurrentUser();

        if ($user['p2q_system_role'] === 'guest' || $user['p2q_system_role'] === 'sales') {
            $view = new ViewModel();
            $view->setTemplate('error/permission');
            return $view;
        }

        $table = $this->params()->fromRoute('table', 'approved');
        $waitingTableCount = $this->quote->countApproval(Quote::WAITING_APPROVAL);
        $approvedTableCount = $this->quote->countApproval(Quote::APPROVED);
        $disapprovedTableCount = $this->quote->countApproval(Quote::DISAPPROVED);

        if ($this->getRequest()->isXmlHttpRequest()) {
            switch ($table) {
                case 'waiting':
                    $TableView = $this->quote->fetchApprovalTable(Quote::WAITING_APPROVAL);
                    return $this->json($TableView);
                case 'approved':
                    $TableView = $this->quote->fetchApprovalTable(Quote::APPROVED);
                    return $this->json($TableView);
                case 'disapproved':
                    $TableView = $this->quote->fetchApprovalTable(Quote::DISAPPROVED);
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

    public function architectAction()
    {
        $user = $this->userService->getCurrentUser();
        if ($user['p2q_system_role'] === 'guest') {
            $view = new ViewModel();
            $view->setTemplate('error/permission');
            return $view;
        }

        $table = $this->params()->fromRoute('table', 'all');

        $admin = false;
        if ($user['p2q_system_role'] === 'admin' || $user['p2q_system_role'] === 'manager') {
            $admin = true;
        }

        if ($this->getRequest()->isXmlHttpRequest()) {
            switch ($table) {
                case 'all':
                    $TableView = $this->architect->fetchAllTable($admin, $user['id']);
                    return $this->json($TableView);
                case 'topfive':
                    $TableView = $this->architect->fetchTopFiveTable($user['id']);
                    return $this->json($TableView);
            }
        }

        $viewModel = new ViewModel([
            'user' => $user,
            'totalArchitects' => $this->architect->countAllArchitects($admin, $user['id']),
            'totalCompleteProjects' => $this->project->countAllCompleteProjects($admin, $user['id']),
            'totalActiveProjects' => $this->project->countActiveProjects($admin, $user['id']),
        ]);

        // If HTMX request, skip layout
        if ($this->getRequest()->getHeader('HX-Request')) {
            $viewModel->setTerminal(true);
        }

        return $viewModel;
    }

    public function opportunitiesAction()
    {
        $user = $this->userService->getCurrentUser();
        if ($user['p2q_system_role'] === 'guest') {
            $view = new ViewModel();
            $view->setTemplate('error/permission');
            return $view;
        }

        $viewModel = new ViewModel([
            'user' => $user,
        ]);

        if ($this->getRequest()->getHeader('HX-Request')) {
            $viewModel->setTerminal(true);
        }

        return $viewModel;
    }

    public function quotesAction()
    {
        $user = $this->userService->getCurrentUser();

        $table = $this->params()->fromRoute('table', 'items'); // default to items table

        if ($this->getRequest()->isXmlHttpRequest()) {
            switch ($table) {
                case 'items':
                    $quotes = $this->getItemModel()->fetchItemQuoteTable();
                    $view = $this->json($quotes);
                    return $view;
            }
        }

        $viewModel = new ViewModel([
            'user' => $user,
        ]);

        if ($this->getRequest()->getHeader('HX-Request')) {
            $viewModel->setTerminal(true);
        }

        return $viewModel;
    }
}
