<?php

declare(strict_types=1);

namespace Application\Controller;

use Laminas\Mvc\Controller\AbstractActionController;
use Laminas\View\Model\ViewModel;
use Laminas\View\Model\JsonModel;

use Application\Service\UserService;
use Application\Model\{Architect, Project, Quote, Note};

class IndexController extends AbstractActionController
{
    protected $userService;
    protected $project;
    protected $quote;
    protected $note;
    protected $architect;

    public function __construct(UserService $userService, Project $project, Quote $quote, Note $note, Architect $architect)
    {
        $this->userService = $userService;
        $this->project = $project;
        $this->quote = $quote;
        $this->note = $note;
        $this->architect = $architect;
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

        $table = $this->params()->fromRoute('table', 'project'); // default to project

        if ($this->getRequest()->isXmlHttpRequest()) {
            switch ($table) {
                case 'project':
                    $useView = $this->params()->fromQuery('view', false);
                    $projects = $useView ? $this->project->fetchAllViews() : $this->project->fetchAll();
                    $view = new JsonModel($projects);
                    return $view;
                case 'quote':
                    $useView = $this->params()->fromQuery('view', false);
                    $quotes = $useView ? $this->quote->fetchAllViews() : $this->quote->fetchAll();
                    $view = new JsonModel($quotes);
                    return $view;
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

    public function homeAction()
    {
        $user = $this->userService->getCurrentUser();

        $table = $this->params()->fromRoute('table', 'own');
        $ownTableCount = $this->project->countOwnProjects($user['id']);
        $assignTableCount = $this->project->countAssignedProjects($user['id']);
        $otherTableCount = $this->project->countOtherUsersProjects($user['id']);
        $quoteTableCount = $this->quote->countOwnQuotes($user['id']);
        $noteTableCount = $this->note->countOwnNotes($user['id']);

        if ($this->getRequest()->isXmlHttpRequest()) {
            switch ($table) {
                case 'own':
                    $TableView = $this->project->fetchOwnProjects($user['id']);
                    return new JsonModel($TableView);
                case 'assigned':
                    $TableView = $this->project->fetchAssignedProjects($user['id']);
                    return new JsonModel($TableView);
                case 'other':
                    $TableView = $this->project->fetchOtherUsersProjects($user['id']);
                    return new JsonModel($TableView);
                case 'quote':
                    $TableView = $this->quote->fetchOwnQuotes($user['id']);
                    return new JsonModel($TableView);
                case 'note':
                    $TableView = $this->note->fetchOwnNotes($user['id']);
                    return new JsonModel($TableView);
            }
        }

        $viewModel = new ViewModel([
            'user' => $user,
            'ownTableCount' => $ownTableCount,
            'assignTableCount' => $assignTableCount,
            'otherTableCount' => $otherTableCount,
            'quoteTableCount' => $quoteTableCount,
            'noteTableCount' => $noteTableCount
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
        $table = $this->params()->fromRoute('table', 'approved');
        $waitingTableCount = $this->quote->countApproval(Quote::WAITING_APPROVAL);
        $approvedTableCount = $this->quote->countApproval(Quote::APPROVED);
        $disapprovedTableCount = $this->quote->countApproval(Quote::DISAPPROVED);

        if ($this->getRequest()->isXmlHttpRequest()) {
            switch ($table) {
                case 'waiting':
                    $TableView = $this->quote->fetchApprovalTable(Quote::WAITING_APPROVAL);
                    return new JsonModel($TableView);
                case 'approved':
                    $TableView = $this->quote->fetchApprovalTable(Quote::APPROVED);
                    return new JsonModel($TableView);
                case 'disapproved':
                    $TableView = $this->quote->fetchApprovalTable(Quote::DISAPPROVED);
                    return new JsonModel($TableView);
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
        $table = $this->params()->fromRoute('table', 'all');

        $admin = false;
        if ($user['sale_role'] === 'admin' || $user['approve_id'] !== null) {
            $admin = true;
        }

        if ($this->getRequest()->isXmlHttpRequest()) {
            switch ($table) {
                case 'all':
                    $TableView = $this->architect->fetchAllTable($admin, $user['id']);
                    return new JsonModel($TableView);
                case 'topfive':
                    $TableView = $this->architect->fetchTopFiveTable($user['id']);
                    return new JsonModel($TableView);
            }
        }

        $viewModel =  new ViewModel([
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
}
