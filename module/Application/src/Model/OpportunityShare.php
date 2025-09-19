<?php

namespace Application\Model;

class OpportunityShare extends Model
{
    public function update(mixed $whereId, array $data): bool
    {
        $share = $this->find($whereId);
        $project = $this->getProjectModel()->fetchByOpportunity($share['opportunity_id']);

        if (! empty($project)) {
            $row = $this->getProjectShareModel()->where([
                'project_id' => $project['id'],
                'shared_user' => $share['shared_user'],
            ]);

            $this->getProjectShareModel()->update($row[0]['id'], ['role' => $data['role']]);
        }

        $info = parent::update($whereId, $data);
        return $info;
    }
}
