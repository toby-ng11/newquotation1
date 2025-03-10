<?php

namespace Application\Controller;

use Laminas\Mvc\Controller\AbstractActionController;
use Laminas\View\Model\JsonModel;

use Application\Model\Customer;

class CustomerController extends AbstractActionController
{
    protected $customer;

    public function __construct(Customer $customer)
    {
        $this->customer = $customer;
    }

    public function fetchAction()
    {
        $pattern = $this->params()->fromQuery('term', null);

        if (empty($pattern)) {
            return new JsonModel(['error' => 'Pattern is required']);
        }

        $customer = $this->customer->fetchCustomerByPattern($pattern);

        return new JsonModel($customer);
    }

    public function fetchbyidAction()
    {
        $id = $this->params()->fromRoute('id', null);

        if (empty($id)) {
            return new JsonModel(['error' => 'ID is required']);
        }

        $customer = $this->customer->fetchCustomerById($id);

        return new JsonModel($customer);
    }
}