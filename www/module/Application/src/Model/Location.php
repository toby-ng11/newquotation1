<?php

namespace Application\Model;

use Laminas\Db\TableGateway\TableGateway;
use Laminas\Db\Sql\Select;

class Location
{
    protected $location;

    public function __construct(TableGateway $location) {
        $this->location = $location;
    }

    function fetchAllBranches()
	{
		$select = $this->location->getSql()->select()
			->order('location_id ASC');

		return $this->location->selectWith($select)->toArray();
	}

	function fetchAllCompanies() {
		$select = $this->location->getSql()->select()
			->columns(['company_id', 'company_name'])
			->quantifier(Select::QUANTIFIER_DISTINCT)
			->order('company_id ASC');
		return $this->location->selectWith($select)->toArray();
	}

    public function fetchLocationIdFromCompany($company_id)
	{
		if ($company_id == null) {
			return false;
		}

		$select = $this->location->getSql()->select()
        ->columns(['location_id'])
		->where(['company_id' => $company_id])
        ->order('location_id ASC');

		return $this->location->selectWith($select)->toArray();
	}
}