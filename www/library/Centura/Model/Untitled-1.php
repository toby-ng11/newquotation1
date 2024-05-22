<?php

$date = '2024-05-20 12:00:00.000';

$datetime = DateTime::createFromFormat('Y-m-d H:i:s', $date);

print_r($datetime->format('Y-m-d'));