<?php

$selectedField = array('quote_id', 'quote_no', 'project_name');
$joinField = array('abc');

$total = $selectedField + $joinField;

var_dump(array_merge($selectedField, $joinField));