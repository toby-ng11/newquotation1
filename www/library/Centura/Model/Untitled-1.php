<?php

echo date('Y-m-d h:i:s', mktime(0, 0, 0, date("m"), date("d") + 90, date("Y")));