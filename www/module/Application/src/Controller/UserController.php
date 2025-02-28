<?php

namespace Application\Controller;

use Laminas\Db\Adapter\AdapterInterface;
use Laminas\Mvc\Controller\AbstractActionController;

class UserController extends AbstractActionController
{
    private $dbAdapter;

    public function __construct(AdapterInterface $dbAdapter)
    {
        $this->dbAdapter = $dbAdapter;
    }

    public function indexAction()
    {
        $sql = "SELECT * FROM P21_Users";
        
        $statement = $this->dbAdapter->query($sql);
        $user = $statement->execute();

        foreach ($user as $row) {
            print_r($row);
        }

        return [];
    }
}