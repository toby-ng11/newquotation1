<?php

namespace Centura\Model;

use Centura\Model\{ Customer, Quote };

use Zend_Registry;
use Zend_Db_Table;
use Zend_Mail;
use Zend_Config_Ini;
use Zend_Mail_Transport_Smtp;
use Zend_Mime_Part;
use Zend_Mime;

use Exception;

class Mail extends Zend_Db_Table
{
    
	
	public function send($quote_id,$from,$from_name,$to,$to_name,$subject,$body,$cc = null,$bcc=null,$attchment_name='quote.pdf',$attchement_url=null,$attchement_type='application/pdf')
	{
		if($from == null && $to == null)
		{
			return  false;
		}
		$subject = html_entity_decode($subject,ENT_QUOTES);
		$mail = new Zend_Mail ();
		
		$c = new Zend_Config_Ini(APPLICATION_PATH . '/configs/application.ini', APPLICATION_ENV);
		
		$config = array('auth' => 'login',
				'username' => $c->resources->mail->config->username,
				'password' => $c->resources->mail->config->password,
				'port' => $c->resources->mail->config->port
		);
		$transport = new Zend_Mail_Transport_Smtp($c->resources->mail->smtp, $config);
		$mail->setFrom($from, $from_name);
		$mail->addTo($to, $to_name);
		if($cc !=null && filter_var($cc, FILTER_VALIDATE_EMAIL))
		{
			$mail->addCc($cc);
		}
		
		if($bcc !=null && filter_var($bcc, FILTER_VALIDATE_EMAIL))
		{
			$mail->addBcc($bcc);
		}
		$mail->setSubject($subject);
		$mail->setBodyHtml($body);
		
		if($attchement_url != null)
		{
			$url = $attchement_url;
			$url = str_replace("newquotation.centura.local" ,"newstatic.centura.local",$url ); // static url
			
			$html =$this->getUrl($url );//access server
		
			$at = new Zend_Mime_Part($html);
			$at->type        = $attchement_type;
			$at->disposition = Zend_Mime::DISPOSITION_ATTACHMENT;
			$at->encoding    = Zend_Mime::ENCODING_BASE64;
			$at->filename    = $attchment_name;
			$mail->addAttachment($at);
		}
		
		try {
			$mail->send ($transport);
			$this->savehistory($quote_id, $from, $to, $subject, $body);
		} catch (Exception $e) {
			var_dump($e);
		}
		return true;
	}
	
	private function getUrl( $url, $username = false , $password = false ) {
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_HEADER, FALSE);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
	
		if( $username && $password ) {
			curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_NTLM);
			curl_setopt($ch, CURLOPT_USERPWD, "$username:$password");
		}
	
		$buffer = curl_exec($ch);
		curl_close($ch);
	
		return $buffer;
	}
	
	public function getcontent($quote_id,$project_name)
	{
		$session =  Zend_Registry::get('session');
		
		$quote = new Quote();
		
		$quote_detail = $quote->fetchquotebyid($quote_id);
		
		$customer = new Customer();
		
		$customer_info = $customer->fetchCustomerById($quote_detail['customer_id']);
		
		$email_template = '/configs/quote-'.strtolower(DEFAULT_COMPNAY).'.email';
		$message = file_get_contents(APPLICATION_PATH . $email_template);
		
		$message = preg_replace('/{QUOTE_ID}/i',$quote_id,$message);
		$message = preg_replace('/{CUSTOMER}/i',$customer_info['fullname'],$message);
		$message = preg_replace('/{EMAIL}/i',$customer_info['email'],$message);
		$message = preg_replace('/{CONTACT}/i',$customer_info['name'],$message);
		$message = preg_replace('/{PROJECT_NAME}/i',$project_name,$message);
		$message = preg_replace('/{SALES_NAME}/i',$session->user['name'],$message);
		$message = preg_replace('/{SALES_EMAIL}/i',$session->user['email'],$message);
		
		if($session->user['sale_role'] == 'manager' )
		{
			$message = preg_replace('/{SALES_ROLE}/i','Sales Manager',$message);
		}
		else
		{
			$message = preg_replace('/{SALES_ROLE}/i','Sales Coordinator',$message);
		}
		
		return $message;
		
	}
	
	private function savehistory($quote_id,$from,$to,$subject,$body)
	{
		if($quote_id == null)
		{
			return false;
		}
		$model = new Zend_Db_Table();
		
		$db = $model->getAdapter();
		
		$data['quote_id'] = $quote_id;
		$data['from']=$from;
		$data['to']  =$to;
		$data['subject']=$subject;
		$data['body']=$body;
		
		try {
			$db->insert('quote_mail_history', $data);
		} catch (Exception $e) {
			var_dump($e);
		}
		return true;
		
	}
	
	
	private function getcsvreceivers()
	{
		$model = new Zend_Db_Table();
		
		$db = $model->getAdapter();
		
		$select = $db->select()->from('csv_emails','email')->where('is_deleted = 0');
		
		$receivers =  $db->fetchAll($select);
		
		return $receivers;
	}
	public function sendcsv($attached_files)
	{
		
		$subject = 'csv report '.date('Y-m-d');
		$subject = html_entity_decode($subject,ENT_QUOTES);
		$mail = new Zend_Mail ();
		
		$c = new Zend_Config_Ini(APPLICATION_PATH . '/configs/application.ini', APPLICATION_ENV);
		
		$config = array('auth' => 'login',
				'username' => $c->resources->mail->config->username,
				'password' => $c->resources->mail->config->password,
				'port' => $c->resources->mail->config->port
		);
		$transport = new Zend_Mail_Transport_Smtp($c->resources->mail->smtp, $config);
		$mail->setFrom('p21alert@centura.ca', 'CSV report');
		
		$receivers = $this->getcsvreceivers();
		foreach($receivers as $to)
		{
			$mail->addTo($to['email'], 'report recevicers');
		}
		
	
		$mail->setSubject($subject);
		$mail->setBodyHtml('CSV report attached');
		
		if($attached_files != null)
		{
			foreach($attached_files as $f_n => $f)
			{
				$at = new Zend_Mime_Part( file_get_contents($f));
				$at->type        = 'text/csv';
				$at->disposition = Zend_Mime::DISPOSITION_ATTACHMENT;
				$at->encoding    = Zend_Mime::ENCODING_BASE64;
				$at->filename    = $f_n;
				$mail->addAttachment($at);
			}
			
		}
		
		try {
			$mail->send ($transport);
		} catch (Exception $e) {
			var_dump($e);
		}
		return true;
	}
	
}

