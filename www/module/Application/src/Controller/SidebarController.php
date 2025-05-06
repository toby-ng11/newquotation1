<?php

namespace Application\Controller;

use Laminas\Mvc\Controller\AbstractActionController;
use Laminas\View\Model\ViewModel;

class SidebarController extends AbstractActionController
{
    public function homeAction()
    {
        return (new ViewModel())->setTemplate('sidebar/default')->setTerminal(true);
    }

    public function adminAction()
    {
        return (new ViewModel())->setTemplate('sidebar/default')->setTerminal(true);
    }

    public function approvalAction()
    {
        return (new ViewModel())->setTemplate('sidebar/default')->setTerminal(true);
    }

    public function architectAction()
    {
        return (new ViewModel())->setTemplate('sidebar/architect-dash')->setTerminal(true);
    }

    public function projectEditAction()
    {
        $projectID = $this->params()->fromRoute('id');
        return (new ViewModel([
            'projectID' => $projectID,
        ]))->setTemplate('sidebar/project-edit')->setTerminal(true);
    }
}
