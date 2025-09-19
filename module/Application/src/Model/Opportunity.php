<?php

namespace Application\Model;

use Application\Service\UserService;
use Laminas\Db\Adapter\Adapter;
use Psr\Container\ContainerInterface;

class Opportunity extends Model
{
    protected $timestamps = true;
    protected $userTracked = true;

    public function __construct(
        Adapter $adapter,
        UserService $userService,
        ContainerInterface $container
    ) {
        parent::__construct($adapter, $userService, $container);
    }

    protected function prepareDataForCreate(array $data): array
    {
        $info = [
            'opp_name'              => trim($data['opp_name']),
            'opp_address'           => ! empty(trim($data['opp_address'])) ? trim($data['opp_address']) : null,
            'lead_source'           => ! empty(trim($data['lead_source'])) ? trim($data['lead_source']) : null,
            'lead_source_id'        => ! empty(trim($data['lead_source_id'])) ? trim($data['lead_source_id']) : null,
            'leed_certified_number' => ! empty(trim($data['leed_certified_number'])) ? trim($data['leed_certified_number']) : null,
            'project_value'         => ! empty(trim($data['project_value'])) ? trim($data['project_value']) : null,
            'project_owner'         => ! empty(trim($data['project_owner'])) ? trim($data['project_owner']) : null,
            'project_description'   => ! empty(trim($data['project_description'])) ? trim($data['project_description']) : null,
            'centura_location_id'   => $data['location_id'],
            'market_segment_id'     => $data['market_segment_id'],
            'status_id'             => $data['status_id'],
            'sample_submitted'      => ! empty(trim($data['sample_submitted'])) ? (int) trim($data['sample_submitted']) : 0,
            'general_contractor_id' => ! empty($data['general_contractor_id']) ? $data['general_contractor_id'] : null,
            'awarded_contractor_id' => ! empty($data['awarded_contractor_id']) ? $data['awarded_contractor_id'] : null,
            'bid_date'              => ! empty($data['bid_date']) ? $data['bid_date'] : null,
            'start_date'            => ! empty($data['start_date']) ? $data['start_date'] : null,
            'completion_date'       => ! empty($data['completion_date']) ? $data['completion_date'] : null,
        ];

        $architect = $this->getArchitectModel()->getByName($data['architect_name']);
        $architectAddress = $this->getAddressModel()->fetchAddressesByArchitect($architect['id'] ?? null);

        if ($architect && empty($data['architect_id']) && ! empty($data['architect_name'])) {
            $info['architect_id'] = $this->getArchitectModel()->edit($data, $architect['id']);
        } elseif (empty($data['architect_id']) && ! empty($data['architect_name'])) {
            $info['architect_id'] = $this->getArchitectModel()->add($data);
        } elseif (! empty($data['architect_id'])) {
            $info['architect_id'] = $this->getArchitectModel()->edit($data, $data['architect_id']);
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
                $info['architect_address_id'] = $this->getAddressModel()->edit($data, $architectAddress['id']);
            } else {
                // No address yet, create a new one
                $info['architect_address_id'] = $this->getAddressModel()->add($data, $info['architect_id']);
            }
        } elseif (! empty($data['address_id'])) {
            // User selected a known address, update it
            $info['architect_address_id'] = $this->getAddressModel()->edit($data, $data['address_id']);
        } else {
            $info['architect_address_id'] = null;
        }

        if (empty($data['specifier_id']) && ! empty($data['specifier_first_name'])) {
            $newSpecifierId = $this->getSpecifierModel()->add($data, $info['architect_id']);
            $info['specifier_id'] = $newSpecifierId;
        } elseif (! empty($data['specifier_id'])) {
            $editSpecifierId = $this->getSpecifierModel()->edit($data, $data['specifier_id']);
            $info['specifier_id'] = $editSpecifierId;
        } else {
            $info['specifier_id'] = null;
        }

        $info = parent::prepareDataForCreate($info);
        return $info;
    }

    protected function prepareDataForUpdate(array $data, mixed $id = 0): array
    {
        $info = [
            'opp_name'              => trim($data['opp_name']),
            'opp_address'           => ! empty(trim($data['opp_address'])) ? trim($data['opp_address']) : null,
            'lead_source'           => ! empty(trim($data['lead_source'])) ? trim($data['lead_source']) : null,
            'lead_source_id'        => ! empty(trim($data['lead_source_id'])) ? trim($data['lead_source_id']) : null,
            'leed_certified_number' => ! empty(trim($data['leed_certified_number'])) ? trim($data['leed_certified_number']) : null,
            'project_value'         => ! empty(trim($data['project_value'])) ? trim($data['project_value']) : null,
            'project_owner'         => ! empty(trim($data['project_owner'])) ? trim($data['project_owner']) : null,
            'project_description'   => ! empty(trim($data['project_description'])) ? trim($data['project_description']) : null,
            'centura_location_id'   => $data['location_id'],
            'market_segment_id'     => $data['market_segment_id'],
            'status_id'             => $data['status_id'],
            'sample_submitted'      => ! empty(trim($data['sample_submitted'])) ? (int) trim($data['sample_submitted']) : 0,
            'general_contractor_id' => ! empty($data['general_contractor_id']) ? $data['general_contractor_id'] : null,
            'awarded_contractor_id' => ! empty($data['awarded_contractor_id']) ? $data['awarded_contractor_id'] : null,
            'bid_date'              => ! empty($data['bid_date']) ? $data['bid_date'] : null,
            'start_date'            => ! empty($data['start_date']) ? $data['start_date'] : null,
            'completion_date'       => ! empty($data['completion_date']) ? $data['completion_date'] : null,
        ];


        $architect = $this->getArchitectModel()->getByName($data['architect_name']);
        $architectAddress = $this->getAddressModel()->fetchAddressesByArchitect($architect['id'] ?? null);

        if ($architect && empty($data['architect_id']) && ! empty($data['architect_name'])) {
            $info['architect_id'] = $this->getArchitectModel()->edit($data, $architect['id']);
        } elseif (empty($data['architect_id']) && ! empty($data['architect_name'])) {
            $info['architect_id'] = $this->getArchitectModel()->add($data);
        } elseif (! empty($data['architect_id'])) {
            $info['architect_id'] = $this->getArchitectModel()->edit($data, $data['architect_id']);
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
                $info['architect_address_id'] = $this->getAddressModel()->edit($data, $architectAddress['id']);
            } else {
                // No address yet, create a new one
                $info['architect_address_id'] = $this->getAddressModel()->add($data, $info['architect_id']);
            }
        } elseif (! empty($data['address_id'])) {
            // User selected a known address, update it
            $info['architect_address_id'] = $this->getAddressModel()->edit($data, $data['address_id']);
        } else {
            $info['architect_address_id'] = null;
        }

        if (empty($data['specifier_id']) && ! empty($data['specifier_first_name'])) {
            $newSpecifierId = $this->getSpecifierModel()->add($data, $info['architect_id']);
            $info['specifier_id'] = $newSpecifierId;
        } elseif (! empty($data['specifier_id'])) {
            $editSpecifierId = $this->getSpecifierModel()->edit($data, $data['specifier_id']);
            $info['specifier_id'] = $editSpecifierId;
        } else {
            $info['specifier_id'] = null;
        }

        $info = parent::prepareDataForUpdate($info, $id);
        return $info;
    }
}
