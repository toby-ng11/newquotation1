<?php

namespace Application\Model;

use Laminas\Db\Adapter\Adapter;
use Laminas\Db\TableGateway\TableGateway;
use Laminas\Db\Sql\{Sql, Expression, Select};

use Application\Model\{Architect, Specifier};

use Exception;

class Project
{
    protected $adapter;
    protected $project;
    protected $p2q_view_project;
    protected $architect;
    protected $address;
    protected $specifier;

    public function __construct(
        Adapter $adapter,
        TableGateway $project,
        TableGateway $p2q_view_project,
        Architect $architect,
        Address $address,
        Specifier $specifier
    ) {
        $this->adapter = $adapter;
        $this->project = $project;
        $this->p2q_view_project = $p2q_view_project;
        $this->architect = $architect;
        $this->address = $address;
        $this->specifier = $specifier;
    }

    public function save($data)
    {
        if (!$data) {
            return  false;
        }

        $info = [
            'delete_flag'           => 'N',
            'project_name'          => trim($data['project_name']),
            'project_address'       => trim($data['project_address']),
            'centura_location_id'   => $data['location_id'],
            'market_segment_id'     => $data['market_segment_id'],
            'owner_id'              => $data['owner_id'],
            'last_maintained_by'    => $data['owner_id'],
            'shared_id'             => $data['shared_id'],
            'reed'                  => trim($data['reed']),
            'status'                => $data['status'],
            'general_contractor_id' => !empty($data['general_contractor_id']) ? $data['general_contractor_id'] : null,
            'awarded_contractor_id' => !empty($data['awarded_contractor_id']) ? $data['awarded_contractor_id'] : null,
            'create_date'           => new Expression('GETDATE()'),
            'require_date'          => !empty($data['require_date']) ? $data['require_date'] : new Expression('GETDATE()'),
            'due_date'              => !empty($data['due_date']) ? $data['due_date'] : new Expression('GETDATE()')
        ];

        $info['architect_id'] = empty($data['architect_id']) && !empty($data['architect_name'])
            ? $this->architect->add($data)
            : $data['architect_id'];

        if (empty($data['address_id']) && array_filter(array_intersect_key($data, array_flip([
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
        ])))) {
            $info['architect_address_id'] = $this->address->add($data, $info['architect_id']);
        } else {
            $info['architect_address_id'] = $data['address_id'] ?? null;
        }

        $info['specifier_id'] = empty($data['specifier_id']) && !empty($data['specifier_name'])
            ? $this->specifier->add($data, $info['architect_id'])
            : $data['specifier_id'] ?? null;

        try {
            $this->project->insert($info);
            $newProjectId = $this->project->getLastInsertValue();

            if ($newProjectId) {
                $updateData = [
                    'project_id_ext' => DEFAULT_COMPANY . '_' . $newProjectId,
                ];

                $this->project->update($updateData, ['project_id' => $newProjectId]);
            }
            return $newProjectId;
        } catch (Exception $e) {
            error_log("Project\save:Database Insert Error: " . $e->getMessage());
            return false;
        }
    }

    public function edit($data, $project_id)
    {
        if (!$data || !$project_id) {
            return  false;
        }

        $info = [
            //'delete_flag'           => 'N',
            'project_name'          => !empty($data['project_name']) ? trim($data['project_name']) : null,
            'project_address'       => !empty($data['project_address']) ? trim($data['project_address']) : null,
            'centura_location_id'   => $data['location_id'],
            'market_segment_id'     => $data['market_segment_id'],
            //'owner_id'              => $data['owner_id'],
            'last_maintained_by'    => $data['user_session_id'],
            'shared_id'             => $data['shared_id'],
            'reed'                  => $data['reed'],
            'status'                => $data['status'],
            'general_contractor_id' => !empty($data['general_contractor_id']) ? $data['general_contractor_id'] : null,
            'awarded_contractor_id' => !empty($data['awarded_contractor_id']) ? $data['awarded_contractor_id'] : null,
            //'create_date'           => new Expression('GETDATE()'),
            'require_date'          => !empty($data['require_date']) ? $data['require_date'] : new Expression('GETDATE()'),
            'due_date'              => !empty($data['due_date']) ? $data['due_date'] : new Expression('GETDATE()')
        ];

        if (empty($data['architect_id']) && !empty($data['architect_name'])) {
            $info['architect_id'] = $this->architect->add($data);
        }

        if (!empty($data['architect_id'])) {
            $info['architect_id'] = $this->architect->edit($data, $data['architect_id']);
        }

        if (empty($data['address_id']) && array_filter(array_intersect_key($data, array_flip([
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
        ])))) {
            $info['architect_address_id'] = $this->address->add($data, $info['architect_id']);
        }
        if (!empty($data['address_id'])) {
            $info['architect_address_id'] = $this->address->edit($data, $data['address_id']);
        } else {
            $info['architect_address_id'] = null;
        }

        if (empty($data['specifier_id']) && !empty($data['specifier_first_name'])) {
            $info['specifier_id'] = $this->specifier->add($data, $info['architect_id']);
        }

        if (!empty($data['specifier_id'])) {
            $info['specifier_id'] = $this->specifier->edit($data, $data['specifier_id']);
        } else {
            $info['specifier_id'] = null;
        }

        try {
            $this->project->update($info, ['project_id' => $project_id]);
            return true;
        } catch (Exception $e) {
            error_log("Project/edit:Database Update Error: " . $e->getMessage());
            return false;
        }
    }

    public function delete($project_id)
    {
        if (!$project_id) {
            return false;
        }

        try {
            $this->project->update(['delete_flag' => 'Y'], ['project_id' => $project_id]);
            return true;
        } catch (Exception $e) {
            error_log("Project/delete:Database Delete Error: " . $e->getMessage());
            return false;
        }
    }

    public function fetchAll()
    {
        return $this->project->select()->toArray();
    }

    public function fetchAllViews()
    {
        return $this->p2q_view_project->select();
    }

    public function fetchById($id)
    {
        return $this->p2q_view_project->select(['project_id' => $id])->current();
    }

    public function fetchOwnProjects($user_id)
    {
        $sql = new Sql($this->adapter);

        $select = $sql->select('p2q_view_project')
            ->where(['owner_id' => $user_id])
            ->order('project_id DESC');

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        return $result;
    }

    public function countOwnProjects($user_id)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('p2q_view_project')
            ->columns(['total' => new Expression('COUNT(*)')])
            ->where(['owner_id' => $user_id]);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute()->current();
        return $result['total'] ?? 0;
    }

    public function fetchAssignedProjects($user_id)
    {
        return $this->p2q_view_project->select(['shared_id' => $user_id])->toArray();
    }

    public function countAssignedProjects($user_id)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('p2q_view_project')
            ->columns(['total' => new Expression('COUNT(*)')])
            ->where(['shared_id' => $user_id]);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute()->current();
        return $result['total'] ?? 0;
    }

    public function fetchOtherUsersProjects($user_id, $company_id = DEFAULT_COMPANY)
    {
        $sql = new Sql($this->adapter);

        $select = $sql->select('p2q_view_project')
            ->where(['company_id' => $company_id]);

        $select->where->notEqualTo('owner_id', $user_id);
        $select->order('project_id DESC');

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        return $result;
    }

    public function countOtherUsersProjects($user_id, $company_id = DEFAULT_COMPANY)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('p2q_view_project')
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

        $select = $sql->select('status')
            ->where([
                'delete_flag' => 'N',
                'project_flag' => 'Y'
            ])
            ->order('status_desc ASC');

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        return $result;
    }

    public function fetchProjectSegment()
    {
        $sql = new Sql($this->adapter);

        $select = $sql->select('market_segment')
            ->where([
                'delete_flag' => 'N'
            ])
            ->order('market_segment_desc ASC');

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        return $result;
    }

    public function fetchQuoteByProject($project_id)
    {
        if (!$project_id) {
            return false;
        }

        $sql = new Sql($this->adapter);
        $select = $sql->select('p2q_view_quote_x_project_x_oe')
            ->where([
                'project_id' => $project_id
            ])
            ->order('quote_id DESC');

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        return $result;
    }

    public function QuoteCountByProject($project_id)
    {
        if (!$project_id) {
            return 0;
        }

        $sql = new Sql($this->adapter);
        $select = $sql->select('quote')
            ->columns(['total' => new Expression('COUNT(*)')])
            ->where(['project_id' => $project_id]);

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute()->current();

        return $result ? (int)$result['total'] : 0;
    }

    public function countAllCompleteProjects($admin, $user_id)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('p2q_view_project')
            ->columns(['total' => new Expression('COUNT(*)')])
            ->where(['status' => 11]);

        if (!$admin) {
            $select->where(['architect_rep_id' => $user_id]);
        }

        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute()->current();
        return $result['total'] ?? 0;
    }
}
