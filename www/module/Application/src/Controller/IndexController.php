<?php

declare(strict_types=1);

namespace Application\Controller;

use Laminas\Mvc\Controller\AbstractActionController;
use Laminas\View\Model\ViewModel;
use Laminas\View\Model\JsonModel;

use Application\Service\UserService;
use Application\Model\Project;
use Application\Model\Quote;

class IndexController extends AbstractActionController
{
    protected $userService;
    protected $project;
    protected $quote;

    public function __construct(UserService $userService, Project $project, Quote $quote)
    {
        $this->userService = $userService;
        $this->project = $project;
        $this->quote = $quote;
    }

    public function indexAction()
    {
        $user = $this->userService->getCurrentUser();
        return new ViewModel([
            'user' => $user
        ]);
    }

    public function adminAction()
    {
        $user = $this->userService->getCurrentUser();

        $table = $this->params()->fromRoute('table', 'project');

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

        return new ViewModel([
            'user' => $user
        ]);
    }

    public function projectAction()
    {
        $user = $this->userService->getCurrentUser();

        return new ViewModel([
            'user' => $user
        ]);
    }
}
