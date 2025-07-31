<?php

namespace Application\Controller;

use Application\Model\Customer;

class CustomerController extends BaseController
{
    protected $customer;

    public function __construct(Customer $customer)
    {
        $this->customer = $customer;
    }

    public function indexAction()
    {
        $request = $this->getRequest();

        if ($request->isXmlHttpRequest()) {
            $pattern = $this->params()->fromQuery('search', null);
            $limit = $this->params()->fromQuery('limit', 10);

            if (empty($pattern)) {
                return json_encode(['error' => 'Pattern is required']);
            }

            $customer = $this->customer->fetchCustomerByPattern($pattern, $limit);

            return json_encode($customer);
        }
        return $this->abort404();
    }

    public function fetchbyidAction()
    {
        $request = $this->getRequest();

        if ($request->isXmlHttpRequest()) {
            $id = $this->params()->fromRoute('id', null);

            if (empty($id)) {
                return json_encode(['error' => 'ID is required']);
            }

            $customer = $this->customer->fetchCustomerById($id);

            return json_encode($customer);
        }
        return $this->abort404();
    }

    public function contactsAction() // fetch customer contacts
    {
        $request = $this->getRequest();

        if ($request->isXmlHttpRequest()) {
            $customer_id = $this->params()->fromRoute('id', null);

            if (empty($customer_id)) {
                return json_encode(['error' => 'Customer ID is required']);
            }

            $contacts = $this->customer->fetchContactsByCustomer($customer_id);

            return json_encode($contacts);
        }
        return $this->abort404();
    }

    public function contactinfoAction() // fetch contact info
    {
        $request = $this->getRequest();

        if ($request->isXmlHttpRequest()) {
            $contact_id = $this->params()->fromRoute('id', null);

            if (empty($contact_id)) {
                return json_encode(['error' => 'Contact ID is required']);
            }

            $contact = $this->customer->fetchContactByID($contact_id);

            return json_encode($contact);
        }

        return $this->abort404();
    }

    public function customerAction() {
        $request = $this->getRequest();

        if ($request->isXmlHttpRequest()) {
            $contact_id = $this->params()->fromRoute('id', null);

            if (empty($contact_id)) {
                return json_encode(['error' => 'Contact ID is required']);
            }

            $contact = $this->customer->fetchCustomerByContact($contact_id);

            return json_encode($contact);
        }

        return $this->abort404();
    }
}
