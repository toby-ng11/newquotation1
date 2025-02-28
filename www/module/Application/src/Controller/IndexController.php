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
        return new ViewModel();
    }

    public function adminAction()
    {
        $user = $this->userService->getCurrentUser();
        
        return new ViewModel([
            'user' => $user
        ]);
    }

    public function projectAction()
    {
        $request = $this->getRequest();
        if ($request->isXmlHttpRequest()) {
            $useView = $this->params()->fromQuery('view', false);
            $projects = $useView ? $this->project->fetchAllViews() : $this->project->fetchAll();
            $view = new JsonModel($projects);
            $view->setTerminal(true);
            //error_log(print_r($view, true));
            return $view;
        }

        return $this->getResponse()->setStatusCode(404);
    }

    public function quoteAction()
    {
        $request = $this->getRequest();
        if ($request->isXmlHttpRequest()) {
            $useView = $this->params()->fromQuery('view', false);
            $quotes = $useView ? $this->quote->fetchAllViews() : $this->quote->fetchAll();
            $view = new JsonModel($quotes);
            $view->setTerminal(true);
            //error_log(print_r($view, true));
            return $view;
        }

        return $this->getResponse()->setStatusCode(404);
    }
}
