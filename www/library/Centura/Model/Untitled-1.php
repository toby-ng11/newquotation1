<?php

$array = (object) array(
    "foo" => "bar",
    "bar" => "foo",
);

$array->foo = "halo";

var_dump($array);