<?php
     // Database connection details
     $dsn = 'sqlsrv:server=192.168.160.16;database=Quotation';
     $user = 'admin';
     $pass = '696946';
 
     // Initialise
     $conn = null;
     try {
         // Database connection
         $pdoObj = new PDO($dsn, $user, $pass);
         if(is_object($pdoObj)){
           echo 'Connection established successfully.';
         }
     }
     catch(PDOException $pe){
         // Throw exception
         echo 'Critical Error: Unable to connect to Database Server because: '.$pe->getMessage();
     }
?>