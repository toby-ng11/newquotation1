<?php

namespace Application\Model;

use Application\Helper\InputValidator;
use Laminas\Db\ResultSet\AbstractResultSet;
use Laminas\Db\ResultSet\ResultSet;
use Laminas\Db\TableGateway\TableGateway;
use Laminas\Db\Sql\Select;

class Location
{
    protected $location;

    public function __construct(TableGateway $location)
    {
        $this->location = $location;
    }

    public function fetchAllBranches(): array
    {
        $select = $this->location->getSql()->select()
            ->order('location_id ASC');

        /** @var ResultSet $rowset */
        $rowset = $this->location->selectWith($select);
        return $rowset->toArray();
    }

    public function fetchAllCompanies(): array
    {
        $select = $this->location->getSql()->select()
            ->columns(['company_id', 'company_name'])
            ->quantifier(Select::QUANTIFIER_DISTINCT)
            ->order('company_id ASC');

        /** @var ResultSet $rowset */
        $rowset = $this->location->selectWith($select);
        return $rowset->toArray();
    }

    public function fetchBranchesFromCompany(string $company_id): array
    {
        $select = $this->location->getSql()->select()
            ->where(['company_id' => $company_id])
            ->order('location_id ASC');

        /** @var AbstractResultSet $rowset */
        $rowset = $this->location->selectWith($select);
        if ($rowset->count() === 1) {
            return $rowset->current() ?? [];
        }

        return $rowset->toArray();
    }

    public function fetchLocationIdFromCompany(string|null $company_id): array
    {
        if (! InputValidator::isValidPattern($company_id)) {
            return [];
        }

        $select = $this->location->getSql()->select()
            ->columns(['location_id'])
            ->where(['company_id' => $company_id])
            ->order('location_id ASC');

        /** @var ResultSet $rowset */
        $rowset = $this->location->selectWith($select);
        $result = $rowset->toArray();

        // Extract just the IDs
        return array_map(fn($row) => (int) $row['location_id'], $result);
    }
}
