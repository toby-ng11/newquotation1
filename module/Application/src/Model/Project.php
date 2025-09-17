<?php

namespace Application\Model;

use Application\Helper\InputValidator;
use Application\Service\UserService;
use Laminas\Db\Adapter\Adapter;
use Laminas\Db\ResultSet\ResultSet;
use Laminas\Db\TableGateway\TableGateway;
use Laminas\Db\Sql\{Sql, Expression, Select};
use Psr\Container\ContainerInterface;
use Exception;

class Project
{
    protected $adapter;
    protected $project;
    protected $p2q_view_projects;
    protected $p2q_view_projects_lite;
    protected $p2q_view_projects_share;
    protected $container;

    public function __construct(
        Adapter $adapter,
        TableGateway $project,
        TableGateway $p2q_view_projects,
        TableGateway $p2q_view_projects_lite,
        TableGateway $p2q_view_projects_share,
        ContainerInterface $container
    ) {
        $this->adapter = $adapter;
        $this->project = $project;
        $this->p2q_view_projects = $p2q_view_projects;
        $this->p2q_view_projects_lite = $p2q_view_projects_lite;
        $this->p2q_view_projects_share = $p2q_view_projects_share;
        $this->container = $container;
    }

    public function getArchitect(): Architect
    {
        return $this->container->get(Architect::class);
    }

    public function getAddress(): Address
    {
        return $this->container->get(Address::class);
    }

    public function getSpecifier(): Specifier
    {
        return $this->container->get(Specifier::class);
    }

    public function getQuote(): Quote
    {
        return $this->container->get(Quote::class);
    }

    public function getUserService(): UserService
    {
        return $this->container->get(UserService::class);
    }

    public function save($data)
    {
        if (! InputValidator::isValidData($data)) {
            return false;
        }

        $info = [
            'project_name'          => trim($data['project_name']),
            'project_address'       => trim($data['project_address']),
            'centura_location_id'   => $data['location_id'],
            'market_segment_id'     => $data['market_segment_id'],
            'created_by'              => $data['owner_id'],
            'updated_by'            => $data['owner_id'],
            'reed'                  => ! empty(trim($data['reed'])) ? trim($data['reed']) : null,
            'status_id'             => $data['status'],
            'general_contractor_id' => ! empty($data['general_contractor_id']) ? $data['general_contractor_id'] : null,
            'awarded_contractor_id' => ! empty($data['awarded_contractor_id']) ? $data['awarded_contractor_id'] : null,
            'created_at'            => new Expression('GETDATE()'),
            'require_date'          => ! empty($data['require_date']) ? $data['require_date'] : new Expression('GETDATE()'),
            'due_date'              => ! empty($data['due_date']) ? $data['due_date'] : new Expression('GETDATE()'),
            'updated_at' => new Expression('GETDATE()'),
        ];

        $architect = $this->getArchitect()->getByName($data['architect_name']);
        $architectAddress = $this->getAddress()->fetchAddressesByArchitect($architect['id'] ?? null);


        if ($architect && empty($data['architect_id']) && ! empty($data['architect_name'])) {
            $info['architect_id'] = $this->getArchitect()->edit($data, $architect['id']);
        } elseif (empty($data['architect_id']) && ! empty($data['architect_name'])) {
            $info['architect_id'] = $this->getArchitect()->add($data);
        } elseif (! empty($data['architect_id'])) {
            $info['architect_id'] = $this->getArchitect()->edit($data, $data['architect_id']);
        } else {
            $info['architect_id'] = null;
        }

        $hasAddressData = array_filter(array_intersect_key($data, array_flip([
            'address_name',
            'phys_address1',
            'phys_address2',
            'phys_city',
            'phys_state',
            'phys_postal_code',
            'phys_country',
            'central_phone_number',
            'email_address',
            'url'
        ])));

        // Case: user typed in address but no address_id given
        if (empty($data['address_id']) && $hasAddressData) {
            if (! empty($architectAddress)) {
                // Update the existing address tied to the architect
                $info['architect_address_id'] = $this->getAddress()->edit($data, $architectAddress['id']);
            } else {
                // No address yet, create a new one
                $info['architect_address_id'] = $this->getAddress()->add($data, $info['architect_id']);
            }
        } elseif (! empty($data['address_id'])) {
            // User selected a known address, update it
            $info['architect_address_id'] = $this->getAddress()->edit($data, $data['address_id']);
        } else {
            $info['architect_address_id'] = null;
        }

        if (empty($data['specifier_id']) && ! empty($data['specifier_first_name'])) {
            $newSpecifierId = $this->getSpecifier()->add($data, $info['architect_id']);
            $info['specifier_id'] = $newSpecifierId;
        } elseif (! empty($data['specifier_id'])) {
            $editSpecifierId = $this->getSpecifier()->edit($data, $data['specifier_id']);
            $info['specifier_id'] = $editSpecifierId;
        } else {
            $info['specifier_id'] = null;
        }

        try {
            $this->project->insert($info);
            $newProjectId = $this->project->getLastInsertValue();

            if ($newProjectId) {
                $company = $this->container->get(Location::class)->fetchCompanyByBranch($data['location_id']);
                $updateData = [
                    'project_id_ext' => $company['company_id'] . '_' . $newProjectId,
                ];

                $this->project->update($updateData, ['id' => $newProjectId]);
            }
            return $newProjectId;
        } catch (Exception $e) {
            error_log("Project\save:Database Insert Error: " . $e->getMessage());
            return false;
        }
    }

    public function edit($data, $project_id)
    {
        if (! InputValidator::isValidData($data) || ! InputValidator::isValidId($project_id)) {
            return false;
        }

        $user = $this->getUserService()->getCurrentUser();

        $info = [
            //'delete_flag'           => 'N',
            'project_name'          => ! empty(trim($data['project_name'])) ? trim($data['project_name']) : null,
            'project_address'       => ! empty(trim($data['project_address'])) ? trim($data['project_address']) : null,
            'centura_location_id'   => $data['location_id'],
            'market_segment_id'     => $data['market_segment_id'],
            //'owner_id'              => $data['owner_id'],
            'updated_by'               => $user['id'],
            'reed'                  => ! empty(trim($data['reed'])) ? trim($data['reed']) : null,
            'status_id'             => $data['status'],
            'general_contractor_id' => ! empty($data['general_contractor_id']) ? $data['general_contractor_id'] : null,
            'awarded_contractor_id' => ! empty($data['awarded_contractor_id']) ? $data['awarded_contractor_id'] : null,
            'updated_at'            => new Expression('GETDATE()'),
            'require_date'          => ! empty($data['require_date']) ? $data['require_date'] : new Expression('GETDATE()'),
            'due_date'              => ! empty($data['due_date']) ? $data['due_date'] : new Expression('GETDATE()')
        ];

        try {
            $this->project->update($info, ['id' => $project_id]);
            return true;
        } catch (Exception $e) {
            error_log("Project/edit:Database Update Error: " . $e->getMessage());
            return false;
        }
    }

    public function editArchitect($data, $project_id)
    {
        if (! InputValidator::isValidData($data) || ! InputValidator::isValidId($project_id)) {
            return false;
        }

        $info = [
            'updated_at' => new Expression('GETDATE()'),
        ];

        if (empty($data['architect_id']) && ! empty($data['architect_name'])) {
            $info['architect_id'] = $this->getArchitect()->add($data);
        } elseif (! empty($data['architect_id'])) {
            $info['architect_id'] = $this->getArchitect()->edit($data, $data['architect_id']);
        } else {
            $info['architect_id'] = null;
        }

        if (
            empty($data['address_id']) && array_filter(array_intersect_key($data, array_flip([
                'address_name',
                'phys_address1',
                'phys_address2',
                'phys_city',
                'phys_state',
                'phys_postal_code',
                'phys_country',
                'central_phone_number',
                'email_address',
                'url'
            ])))
        ) {
            $info['architect_address_id'] = $this->getAddress()->add($data, $info['architect_id']);
        } elseif (! empty($data['address_id'])) {
            $info['architect_address_id'] = $this->getAddress()->edit($data, $data['address_id']);
        } else {
            $info['architect_address_id'] = null;
        }

        if (empty($data['specifier_id']) && ! empty($data['specifier_first_name'])) {
            $info['specifier_id'] = $this->getSpecifier()->add($data, $info['architect_id']);
        } elseif (! empty($data['specifier_id'])) {
            $info['specifier_id'] = $this->getSpecifier()->edit($data, $data['specifier_id']);
        } else {
            $info['specifier_id'] = null;
        }

        try {
            $this->project->update($info, ['id' => $project_id]);
            return true;
        } catch (Exception $e) {
            error_log("Project/edit:Database Update Error: " . $e->getMessage());
            return false;
        }
    }

    public function delete($project_id)
    {
        if (! InputValidator::isValidId($project_id)) {
            return false;
        }

        $quotes = $this->fetchQuoteByProject($project_id);
        foreach ($quotes as $quote) {
            $this->getQuote()->delete($quote['quote_id']);
        }

        try {
            $this->project->delete(['id' => $project_id]);
            return true;
        } catch (Exception $e) {
            error_log("Project/delete:Database Delete Error: " . $e->getMessage());
            return false;
        }
    }

    public function clearAddressAndSpecifierByArchitect($architect_id)
    {
        if (! InputValidator::isValidId($architect_id)) {
            return false;
        }

        try {
            $this->project->update(
                [
                    'architect_address_id' => null,
                    'specifier_id' => null,
                    'architect_id' => null,
                    'updated_at' => new Expression('GETDATE()')
                ],
                ['architect_id' => $architect_id]
            );
            return true;
        } catch (Exception $e) {
            error_log("Project/nullify: DB update error for architect $architect_id: " . $e->getMessage());
            return false;
        }
    }

    public function fetchAll()
    {
        $rowset = $this->project->select();
        return iterator_to_array($rowset, true);
    }

    public function fetchAllViews()
    {
        $rowset = $this->p2q_view_projects_lite->select();
        return iterator_to_array($rowset, true);
    }

    public function fetchById($id, bool $view = false)
    {
        if (! InputValidator::isValidId($id)) {
            return;
        }

        if ($view) {
            /** @var ResultSet $rowset */
            $rowset = $this->p2q_view_projects->select(['id' => $id]);
            $row = $rowset->current();
            return $row;
        }

        $id = (int) $id;
        /** @var ResultSet $rowset */
        $rowset = $this->project->select(['id' => $id]);
        $row = $rowset->current();
        return $row;
    }

    public function fetchOwnProjects($user_id)
    {
        if (! InputValidator::isValidData($user_id)) {
            return false;
        }

        $sql = new Sql($this->adapter);
        $select = $sql->select('p2q_view_projects_lite')
            ->where(['owner_id' => $user_id]);

        $statement = $sql->prepareStatementForSqlObject($select);
        return iterator_to_array($statement->execute(), true);
    }

    public function countOwnProjects($user_id): int
    {
        if (! InputValidator::isValidData($user_id)) {
            return false;
        }

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('p2q_view_projects')
            ->columns(['total' => new Expression('COUNT(*)')])
            ->where(['owner_id' => $user_id]);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute()->current();
        return (int) $result['total'] ?? 0;
    }

    public function fetchAssignedProjects($user_id)
    {
        if (! InputValidator::isValidData($user_id)) {
            return false;
        }
        /** @var ResultSet $rowset */
        $rowset = $this->p2q_view_projects_share->select(['shared_user' => $user_id]);
        return $rowset->toArray();
    }

    public function countAssignedProjects($user_id)
    {
        if (! InputValidator::isValidData($user_id)) {
            return false;
        }

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('p2q_view_projects_share')
            ->columns(['total' => new Expression('COUNT(*)')])
            ->where(['shared_user' => $user_id]);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute()->current();
        return $result['total'] ?? 0;
    }

    public function fetchOtherUsersProjects($user_id, $company_id = DEFAULT_COMPANY)
    {
        if (! InputValidator::isValidData($user_id)) {
            return false;
        }

        $user = $this->getUserService()->getCurrentUser();

        $sql = new Sql($this->adapter);

        $select = $sql->select('p2q_view_projects');

        if ($user['p2q_system_role'] !== 'admin' && $user['p2q_system_role'] !== 'manager') {
            $select->where(['company_id' => $company_id]);
        }

        $select->where->notEqualTo('owner_id', $user_id);
        $select->order('id DESC');

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        return iterator_to_array($result, true);
    }

    public function countOtherUsersProjects($user_id, $company_id = DEFAULT_COMPANY)
    {
        if (! InputValidator::isValidData($user_id)) {
            return false;
        }

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('p2q_view_projects')
            ->columns(['total' => new Expression('COUNT(*)')])
            ->where(['company_id' => $company_id]);

        $select->where->notEqualTo('owner_id', $user_id);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute()->current();
        return $result['total'] ?? 0;
    }

    public function fetchProjectStatus()
    {
        $sql = new Sql($this->adapter);

        $select = $sql->select('statuses')
            ->where([
                'project_flag' => 'Y'
            ])
            ->order('status_desc ASC');

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        return iterator_to_array($result, true);
    }

    public function fetchProjectSegment()
    {
        $sql = new Sql($this->adapter);

        $select = $sql->select('market_segments')
            ->order('market_segment_desc ASC');

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        return iterator_to_array($result, true);
    }

    public function fetchQuoteByProject($project_id)
    {
        if (! InputValidator::isValidId($project_id)) {
            return false;
        }

        $sql = new Sql($this->adapter);
        $select = $sql->select('p2q_view_quote_x_project_x_oe')
            ->where([
                'project_id' => $project_id
            ])
            ->order('id DESC');

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        return iterator_to_array($result, true);
    }

    public function quoteCountByProject($project_id)
    {
        if (! InputValidator::isValidId($project_id)) {
            return false;
        }

        $sql = new Sql($this->adapter);
        $select = $sql->select('quotes')
            ->columns(['total' => new Expression('COUNT(*)')])
            ->where(['project_id' => $project_id]);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute()->current();

        return $result ? (int)$result['total'] : 0;
    }

    public function countAllCompleteProjects($admin, $user_id)
    {
        if (! InputValidator::isValidData($user_id)) {
            return false;
        }

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('p2q_view_projects')
            ->columns(['total' => new Expression('COUNT(*)')])
            ->where(['status_id' => 10]);

        if (! $admin) {
            $select->where(['architect_rep_id' => $user_id]);
        }

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute()->current();
        return $result['total'] ?? 0;
    }

    public function countActiveProjects($admin, $user_id)
    {
        if (! InputValidator::isValidData($user_id)) {
            return false;
        }

        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('p2q_view_projects')
            ->columns(['total' => new Expression('COUNT(*)')])
            ->where(["status_id not in (10, 12, 13)"]);

        if (! $admin) {
            $select->where(['architect_rep_id' => $user_id]);
        }

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute()->current();
        return $result['total'] ?? 0;
    }
}
