<?php

declare(strict_types=1);

namespace Application\Controller;

use Laminas\Mvc\Controller\AbstractActionController;
use Laminas\Mvc\Plugin\FlashMessenger;
use Laminas\View\Model\{ViewModel, JsonModel};

use Application\Service\UserService;
use Application\Model\{Project, Quote, Location, Item, Note, Architect, Specifier};

class QuoteController extends AbstractActionController
{
    protected $userService;
    protected $quote;
    protected $project;
    protected $location;
    protected $item;

    public function __construct(
        UserService $userService,
        Quote $quote,
        Project $project,
        Location $location,
        Item $item
    ) {
        $this->userService = $userService;
        $this->quote = $quote;
        $this->project = $project;
        $this->location = $location;
        $this->item = $item;
    }

    public function editAction() {
        $project_id = $this->params()->fromQuery('project');

        $user = $this->userService->getCurrentUser();
        $project = $this->project->fetchById($project_id);

        return new ViewModel([
            'user' => $user,
            'project' => $project,
        ]);
    }
}
