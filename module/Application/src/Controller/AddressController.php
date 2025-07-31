<?php

namespace Application\Controller;

use Application\Model\Address;
use Exception;

class AddressController extends BaseController
{
    protected $address;

    public function __construct(Address $address)
    {
        $this->address = $address;
    }

    public function indexAction()
    {
        $request = $this->getRequest();

        if ($request->isPost()) {
            return $this->createAction();
        }

        if ($request->isXmlHttpRequest()) {
            $addressID = $this->params()->fromRoute('id');

            if ($addressID) {
                $address = $this->address->fetchAddressesById($addressID);

                if (! $address) {
                    return json_encode([
                        'success' => false,
                        'message' => 'Address not found.'
                    ]);
                }

                return json_encode([
                    'success' => true,
                    'address' => [
                        'address_name' => $address['name'],
                        'phys_address1' => $address['phys_address1'],
                        'phys_address2' => $address['phys_address2'],
                        'phys_city' => $address['phys_city'],
                        'phys_state' => $address['phys_state'],
                        'phys_postal_code' => $address['phys_postal_code'],
                        'phys_country' => $address['phys_country'],
                        'central_phone_number' => $address['central_phone_number'],
                        'email_address' => $address['email_address'],
                        'url' => $address['url'],
                    ],
                ]);
            }
        }

        return $this->abort404();
    }

    public function createAction()
    {
        $request = $this->getRequest();

        if ($request->isXmlHttpRequest()) {
            $architect_id = $this->params()->fromPost('architect_id', null);
            $data = $this->params()->fromPost();

            $missingFields = [];

            if (! $architect_id) {
                $missingFields[] = 'Architect ID';
            }
            if (empty($data['phys_address1'])) {
                $missingFields[] = 'Address 1';
            }

            if (! $architect_id || empty($data['phys_address1'])) {
                return json_encode([
                    'success' => false,
                    'message' => 'Missing required fields: ' . implode(', ', $missingFields)
                ]);
            }

            try {
                $result = $this->address->add($data, $architect_id);

                return json_encode([
                    'success' => true,
                    'message' => 'Address added!',
                    'note_id' => $result
                ]);
            } catch (Exception $e) {
                return json_encode([
                    'success' => false,
                    'message' => 'Failed to add address.',
                    'error' => $e->getMessage()
                ]);
            }
        }

        return $this->abort404();
    }

    public function editAction()
    {
        $request = $this->getRequest();
        $address_id = $this->params()->fromRoute('id');

        if (! $address_id) {
            return json_encode([
                'success' => false,
                'message' => 'Missing address ID.'
            ]);
        }

        if ($request->isPost()) {
            $data = $this->params()->fromPost();

            try {
                $result = $this->address->edit($data, $address_id);

                return json_encode([
                    'success' => true,
                    'message' => 'Address saved!',
                    'note_id' => $result
                ]);
            } catch (Exception $e) {
                return json_encode([
                    'success' => false,
                    'message' => 'Failed to edit address.',
                    'error' => $e->getMessage()
                ]);
            }
        }

        return $this->abort404();
    }

    public function deleteAction()
    {
        $address_id = $this->params()->fromRoute('id', null);
        $request = $this->getRequest();

        if (! $address_id || ! $request->isXmlHttpRequest()) {
            return json_encode([
                'success' => false,
                'message' => 'Invalid request.',
            ]);
        }

        if ($request->isPost()) {
            try {
                $result = $this->address->delete($address_id);

                if ($result) {
                    return json_encode([
                        'success' => true,
                        'message' => 'Address deleted!',
                    ]);
                } else {
                    return json_encode([
                        'success' => false,
                        'message' => 'Failed to delete address.',
                    ]);
                }
            } catch (Exception $e) {
                return json_encode([
                    'success' => false,
                    'message' => 'Failed to delete address.',
                    'error' => $e->getMessage()
                ]);
            }
        }

        return $this->abort404();
    }
}
