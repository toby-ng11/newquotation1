<?php

namespace Application\Controller;

use Laminas\View\Model\JsonModel;
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
                return new JsonModel(['error' => 'Pattern is required']);
            }

            $customer = $this->customer->fetchCustomerByPattern($pattern, $limit);

            return new JsonModel($customer);
        }
        return $this->abort404();
    }

    public function fetchbyidAction()
    {
        $request = $this->getRequest();

        if ($request->isXmlHttpRequest()) {
            $id = $this->params()->fromRoute('id', null);

            if (empty($id)) {
                return new JsonModel(['error' => 'ID is required']);
            }

            $customer = $this->customer->fetchCustomerById($id);

            return new JsonModel($customer);
        }
        return $this->abort404();
    }

    public function contactsAction() // fetch customer contacts
    {
        $request = $this->getRequest();

        if ($request->isXmlHttpRequest()) {
            $customer_id = $this->params()->fromRoute('id', null);

            if (empty($customer_id)) {
                return new JsonModel(['error' => 'Customer ID is required']);
            }

            $contacts = $this->customer->fetchContactsByCustomer($customer_id);

            return new JsonModel($contacts);
        }
        return $this->abort404();
    }

    public function contactinfoAction() // fetch contact info
    {
        $request = $this->getRequest();

        if ($request->isXmlHttpRequest()) {
            $contact_id = $this->params()->fromRoute('id', null);

            if (empty($contact_id)) {
                return new JsonModel(['error' => 'Contact ID is required']);
            }

            $contact = $this->customer->fetchContactByID($contact_id);

            return new JsonModel($contact);
        }

        return $this->abort404();
    }
}
