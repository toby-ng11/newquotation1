<?php
$url= "http://newquotation.centura.local/project/print/id/21766?company=TOR&name=Centura_Project_vincent_test.pdf";
$username= 'centura\join';
$password = 'C3ntura!';

$html =getUrl($url, $username, $password );

echo $html;

function getUrl( $url, $username = false , $password = false ) {
  $ch = curl_init(); 
  curl_setopt($ch, CURLOPT_URL, $url); 
curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_NTLM);

   curl_setopt($ch, CURLOPT_PROXYAUTH, CURLAUTH_NTLM);

    curl_setopt($ch, CURLOPT_USERPWD, "$username:$password");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE); 


  $buffer = curl_exec($ch); 
  curl_close($ch); 

  return $buffer;
}

?>