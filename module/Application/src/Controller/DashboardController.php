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

    public function opportunityAction(): Response | ViewModel
    {
        return $this->render('dashboards/opportunity');
    }

    public function projectAction(): Response | ViewModel
    {
        return $this->render('dashboards/project');
    }

    public function quoteAction(): Response | ViewModel
    {
        return $this->render('dashboards/quote');
    }

    public function architectAction(): Response | ViewModel
    {
        return $this->render('dashboards/architect');
    }

    public function quoteditemsAction(): Response | ViewModel
    {
        return $this->render('dashboards/quoted-items');
    }
}
