<?php
error_reporting(1);

use Dompdf\Dompdf;
use Dompdf\Options;

// include autoloader
require_once 'autoload.inc.php';
$url = str_replace("devquotation.centura.local", "newstatic.centura.local", $_GET["url"]);
$name = str_replace('.pdf', '', $_GET["name"]);
$username= 'centura\join';
$password = 'C3ntura!';
if ($name == null) {
  $name = 'centura_' . date('y-m-d') . '.pdf';
}

$context = stream_context_create(array(
  'http' => array(
      'header'  => "Authorization: Basic " . base64_encode("$username:$password")
  )
));
$html = getUrl($url);

$options = new Options();
$options->set('isRemoteEnabled', TRUE);
$options->set('isPhpEnabled', TRUE);
$options->set('defaultMediaType', "print");

$dompdf = new Dompdf($options);
$dompdf->setProtocol('http://');
$dompdf->setBaseHost('newstatic.centura.local');
$dompdf->setBasePath('/');
$dompdf->loadHtml($html);

$dompdf->render();
$dompdf->stream($name);



function getUrl($url)
{
  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, $url);
  curl_setopt($ch, CURLOPT_HEADER, FALSE);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);



  $buffer = curl_exec($ch);
  curl_close($ch);

  return $buffer;
}
