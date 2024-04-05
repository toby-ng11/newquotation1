<?php

$result = [0 => ['project_id' => 25304, 'product_id' => 'AR0350BK', 'qty' => '70.00', 'sort_id' => 1712145841, 'note' => '', 'uom' => 'LF', 'unit_price' => '61.86', 'subtotal' => '4330.20', 'status' => 1, 'added' => 100, 'editor' => 'TNGUYEN', 'id' => 47213, 'item_desc' => 'Mat Tech 3ftX50ft Astro Turf Black'],
    1 => ['project_id' => 25304, 'product_id' => 'AR031224', 'qty' => '4.00', 'sort_id' => 1712160071, 'note' => 'egegevbevevev', 'uom' => 'PC', 'unit_price' => '20.02', 'subtotal' => '80.08', 'status' => 1, 'added' => 100, 'editor' => 'TNGUYEN', 'id' => 47221, 'item_desc' => 'Mirage 12X24 Area 03 Military'],
    2 => ['project_id' => 25304, 'product_id' => 'AR0124', 'qty' => '50.00', 'sort_id' => 1712236475, 'note' => 'qqfqfqfqfqf', 'uom' => 'PC', 'unit_price' => '47.36', 'subtotal' => '2368.00', 'status' => 1, 'added' => 100, 'editor' => 'TNGUYEN', 'id' => 47242, 'item_desc' => 'Mirage 24X24 Area 01 Pietra Arria'] ];

$product = array();
foreach ($result as $item) {
    $arr[] = $item["product_id"];
}

echo implode(", ", $arr);