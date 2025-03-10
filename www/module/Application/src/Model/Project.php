<?php

namespace Application\Model;

use Laminas\Db\Adapter\Adapter;
use Laminas\Db\TableGateway\TableGatewayInterface;
use Laminas\Db\TableGateway\TableGateway;
use Laminas\Db\Sql\{Sql, Expression};

use Application\Model\{Architect, Specifier};

use Exception;

class Project
{
    protected $adapter;
    protected $project;
    protected $p2q_view_project;
    protected $architect;
    protected $specifier;

    public function __construct(
        Adapter $adapter,
        TableGateway $project,
        TableGatewayInterface $p2q_view_project,
        Architect $architect,
        Specifier $specifier
    ) {
        $this->adapter = $adapter;
        $this->project = $project;
        $this->p2q_view_project = $p2q_view_project;
        $this->architect = $architect;
        $this->specifier = $specifier;
    }

    public function save($data) {
        if ($data == null) {
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
            'reed'                  => $data['reed'],
            'status'                => $data['status'],
            'general_contractor_id' => !empty($data['general_contractor_id']) ? $data['general_contractor_id'] : null,
            'awarded_contractor_id' => !empty($data['awarded_contractor_id']) ? $data['awarded_contractor_id'] : null,
            'create_date'           => new Expression('GETDATE()'),
            'require_date'          => !empty($data['require_date']) ? $data['require_date'] : new Expression('GETDATE()'),
            'due_date'              => !empty($data['due_date']) ? $data['due_date'] : new Expression('GETDATE()')
        ];

        if (empty($data['architect_id']))
		{
			$info['architect_id'] = $this->architect->add($data);
		} else {
			$info['architect_id'] = $data['architect_id'];
        }

        if (empty($data['specifier_id']))
		{
			$info['specifier_id'] = $this->specifier->add($data, $info['architect_id']);
		} else {
			$info['specifier_id'] = $data['specifier_id'];
        }

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

    public function fetchAll()
    {
        return $this->project->select()->toArray();
    }

    public function fetchAllViews()
    {
        return $this->p2q_view_project->select()->toArray();
    }

    public function fetchById($id)
    {
        return $this->p2q_view_project->select(['project_id' => $id])->current();
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

        $selectString = $sql->buildSqlString($select);
        $result = $this->adapter->query($selectString, $this->adapter::QUERY_MODE_EXECUTE);
        return $result;
    }

    public function fetchProjectSegment()
    {
        $sql = new Sql($this->adapter);

        $select = $sql->select('market_segment')
        ->where ([
            'delete_flag' => 'N'
        ])
        ->order('market_segment_desc ASC');

        $selectString = $sql->buildSqlString($select);
        $result = $this->adapter->query($selectString, $this->adapter::QUERY_MODE_EXECUTE);
        return $result;
    }
}