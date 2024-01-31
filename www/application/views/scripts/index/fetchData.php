<?php

$dbDetails = array(
    'host' => '192.168.160.11',
    'user' => 'admin',
    'pass'=> '696946',
    'db' => 'Quotation'
);

//DB table to use
$db = $this->getAdapter();
$table = $db->select()->from('quote')->order('quote_id desc')->join('project', 'project.project_id = quote.project_id','project_name')
		->join('quote_status','quote_status.uid=project.status',array('status_name'=>'Status'))->where('project.deleted =?','N');

// Table's primary key
$primaryKey = 'quote_id';

$columns = array(
    array('db' => 'quote_id', 'dt' => 0),
    array('db' => 'project_name', 'dt' => 1),
    array('db' => 'quote_segment', 'dt' => 2),
    array('db' => 'quote_date', 'dt' => 3),
    array('db' => 'expire_date', 'dt' => 4),
    array('db' => 'ship_required_date', 'dt' => 5),
    array('db' => 'status_name', 'dt' => 6),
    array('db' => 'approve_status', 'dt' => 7),
);

require 'ssp.class.php';

echo Zend_Json::encode(
    SSP::simple($_GET, $dbDetails, $table, $primaryKey, $columns)
);