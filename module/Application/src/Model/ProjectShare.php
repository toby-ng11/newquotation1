<?php

namespace Application\Model;

use Application\Helper\InputValidator;
use Application\Service\UserService;
use Exception;
use Laminas\Db\Adapter\Adapter;
use Laminas\Db\Sql\Expression;
use Laminas\Db\Sql\Sql;
use Laminas\Db\TableGateway\TableGateway;
use Psr\Container\ContainerInterface;

class ProjectShare
{
    protected $adapter;
    protected $project_shares;
    protected $container;

    public function __construct(
        Adapter $adapter,
        TableGateway $project_shares,
        ContainerInterface $container
    ) {
        $this->adapter = $adapter;
        $this->project_shares = $project_shares;
        $this->container = $container;
    }

    public function getUserService()
    {
        return $this->container->get(UserService::class);
    }

    public function add($data, $projectID)
    {
        if (! InputValidator::isValidData($data) || ! InputValidator::isValidId($projectID)) {
            return false;
        }

        $user = $this->getUserService()->getCurrentUser();

        $info = [
            'project_id'            => $projectID,
            'shared_user'           => trim($data['shared_user']),
            'role'                  => trim($data['role']),
            'created_by'            => $user['id'],
            'created_at'            => new Expression('GETDATE()'),
        ];

        try {
            $this->project_shares->insert($info);
            $newProjectShareId = $this->project_shares->getLastInsertValue();
            return $newProjectShareId;
        } catch (Exception $e) {
            error_log("ProjectShare\add: Database Insert Error: " . $e->getMessage());
            return false;
        }
    }

    public function edit($data, $id)
    {
        if (! InputValidator::isValidData($data) || ! InputValidator::isValidId($id)) {
            return false;
        }

        $user = $this->getUserService()->getCurrentUser();

        $info = [
            'shared_user'           => trim($data['shared_user']),
            'role'                  => trim($data['role']),
            'updated_by'            => $user['id'],
            'updated_at'            => new Expression('GETDATE()'),
        ];

        try {
            $this->project_shares->update($info, ['id' => $id]);
            return $id;
        } catch (Exception $e) {
            error_log("ProjectShare/edit: Database Insert Error: " . $e->getMessage());
            return false;
        }
    }

    public function delete($id)
    {
        if (! InputValidator::isValidId($id)) {
            return false;
        }

        $user = $this->getUserService()->getCurrentUser();

        try {
            $this->project_shares->delete(['id' => $id]);
            return $id;
        } catch (Exception $e) {
            error_log("ProjectShare/delete: Database Insert Error: " . $e->getMessage());
            return false;
        }
    }

    public function fetchByID($id)
    {
        if (! InputValidator::isValidId($id)) {
            return false;
        }

        $sql = new Sql($this->adapter);
        $select = $sql->select('project_shares')
            ->where([
                'id' => $id
            ]);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute()->current();
        return $result;
    }

    public function fetchDataTables(mixed $id): array
    {
        if (! $id) {
            return [];
        }

        $sql = new Sql($this->adapter);
        $select = $sql->select('project_shares')
            ->columns(['id', 'project_id', 'shared_user', 'role'])
            ->where([
                'project_id' => $id
            ]);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        return iterator_to_array($result, true);
    }

    public function isShareExists(int $projectId, string $userId): bool
    {
        if (! InputValidator::isValidId($projectId) || ! InputValidator::isValidPattern($userId)) {
            return false;
        }

        $sql = new Sql($this->adapter);
        $select = $sql->select('project_shares')
            ->columns(['id'])
            ->where([
                'project_id' => $projectId,
                'shared_user' => $userId
            ])
            ->limit(1)->offset(0);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        return ($result->current() !== false);
    }
}
