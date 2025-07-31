<?php

namespace Application\Model\View;

use Laminas\Db\TableGateway\TableGateway;

class P21User
{
    protected $table;

    public function __construct(
        TableGateway $table,
    ) {
        $this->table = $table;
    }

    public function fetchAll()
    {
        return $this->table->select();
    }
}
