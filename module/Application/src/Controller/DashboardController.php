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
        return $this->inertia('dashboards/home');
    }

    public function adminAction(): Response | ViewModel
    {
        return $this->inertia('dashboards/admin');
    }

    public function opportunityAction(): Response | ViewModel
    {
        return $this->inertia('dashboards/opportunity');
    }

    public function projectAction(): Response | ViewModel
    {
        return $this->inertia('dashboards/project');
    }

    public function quoteAction(): Response | ViewModel
    {
        return $this->inertia('dashboards/quote');
    }

    public function architectAction(): Response | ViewModel
    {
        return $this->inertia('dashboards/architect');
    }

    public function quoteditemsAction(): Response | ViewModel
    {
        return $this->inertia('dashboards/quoted-items');
    }
}
