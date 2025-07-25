<?php

namespace Application\Controller;

use Laminas\Db\Adapter\AdapterInterface;
use Laminas\View\Model\JsonModel;
use Application\Model\User;

class UserController extends BaseController
{
    private $dbAdapter;
    protected $user;

    public function __construct(AdapterInterface $dbAdapter, User $user)
    {
        $this->dbAdapter = $dbAdapter;
        $this->user = $user;
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

    public function fetchbypatternAction()
    {
        $pattern = $this->params()->fromQuery('pattern', '');
        $limit = (int) $this->params()->fromQuery('limit', 10);

        if (empty($pattern)) {
            return new JsonModel(['error' => 'Pattern is required']);
        }

        $users = $this->user->fetchUserIdByPattern($pattern, $limit);
        return new JsonModel($users);
    }
}
