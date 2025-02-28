<?php

namespace Application\Model;

use Laminas\Db\TableGateway\TableGatewayInterface;

class Quote
{
    protected $quote;
    protected $p2q_view_quote_x_project_x_oe;

    public function __construct(TableGatewayInterface $quote, TableGatewayInterface $p2q_view_quote_x_project_x_oe)
    {
        $this->quote = $quote;
        $this->p2q_view_quote_x_project_x_oe = $p2q_view_quote_x_project_x_oe;
    }

    public function fetchAll()
    {
        return $this->quote->select()->toArray();
    }

    public function fetchAllViews()
    {
        return $this->p2q_view_quote_x_project_x_oe->select()->toArray();
    }
}