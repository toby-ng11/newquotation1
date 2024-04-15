<?php

namespace Centura\Model;

use Zend_Registry;
use Zend_Json;
use Exception;

class Customer extends DbTable\Customer
{
    
	public function fetchCustomerById($id)
	{
	    if($id == null)
	    {
	        return  false;
	    }
	    $db = $this->getAdapter();
	    $select = $db->select()->from('P21_Customer_X_Address_X_Contacts',array('customer_id','name','email'=>'Contacts_email','company_id',
	    			'tel'=>'central_phone_number','first_name',"last_name",'fullname','phys_address1','phys_address2','phys_city','mail_state','mail_postal_code','phys_country','sale_rep'))
	    			->where('customer_id = ?',$id);
	    
		$select2 = $db->select()->from('customer',array('customer_id','name','email'=>'Contacts_email','company_id',
	    			'tel'=>'central_phone_number','first_name',"last_name",'fullname','phys_address1','phys_address2','phys_city','mail_state','mail_postal_code','phys_country','sale_rep'))
	    			->where('customer_id = ?',$id);
		$result = $this->merge( $db->fetchRow($select),$db->fetchRow($select2));

		echo Zend_Json::encode($result);
	    return $result;
	    
	}
	
	public function fetchCustomerByEmail($email,$company = DEFAULT_COMPNAY)
	{
		if($email == null)
		{
			return  false;
		}
		 $db = $this->getAdapter();
	    $select = $db->select()->from('P21_Customer_X_Address_X_Contacts',array('customer_id','name','email'=>'Contacts_email','company_id',
	    			'tel'=>'central_phone_number','first_name',"last_name",'phys_address1','phys_address2','phys_city','mail_state','mail_postal_code','phys_country'))
	    	->where('Contacts_email = ?',$email)->where('company_id = ?',$company);
	    
	    $select2 = $db->select()->from('customer',array('customer_id','name','email'=>'Contacts_email','company_id',
	    		'tel'=>'central_phone_number','first_name',"last_name",'phys_address1','phys_address2','phys_city','mail_state','mail_postal_code','phys_country'))
	    		->where('Contacts_email = ?',$email)->where('company_id = ?',$company);
	    
	    $result = $this->merge($db->fetchRow($select2), $db->fetchRow($select));
	    
	    return $result;
	}
	
	public function fetchCustomerEmailByIdPatten($patten,$limit=20, $company = DEFAULT_COMPNAY)
	{
	    $db = $this->getAdapter();
	    $select = $db->select()->from('P21_Customer_X_Address_X_Contacts',array('customer_id','email'=>'Contacts_email','first_name',"last_name"))
	    	->where('Contacts_email LIKE ?','%'.$patten.'%')->where('company_id = ?',$company);
	    $select->limit($limit);
	    
	    $select2 = $db->select()->from('customer',array('customer_id','email'=>'Contacts_email','first_name',"last_name"))
	    ->where('Contacts_email LIKE ?','%'.$patten.'%')->where('company_id = ?',$company);
	    $select->limit($limit);
	    
	    $result = $this->merge($db->fetchAll($select2), $db->fetchAll($select));
	    
	    return $result;
	}
	
	public function fetchCustomeridByIdPatten($patten,$limit=20, $company = DEFAULT_COMPNAY)
	{
		$db = $this->getAdapter();
		$select = $db->select()->from('P21_Customer_X_Address_X_Contacts',array('customer_id','first_name',"last_name"))
		->where('customer_id LIKE ?',$patten.'%')->where('company_id = ?',$company);;
		$select->limit($limit);
		
		$select2 = $db->select()->from('customer',array('customer_id','first_name',"last_name"))
		->where('customer_id LIKE ?',$patten.'%')->where('company_id = ?',$company);;
		$select->limit($limit);
		
		$result = $this->merge($db->fetchAll($select2), $db->fetchAll($select));
		 
		return $result;
	}
	
	public function fetchCustomerInfoBynamePatten($patten,$limit=40, $company = DEFAULT_COMPNAY)
	{
		$db = $this->getAdapter();
		$select = $db->select()->from('P21_Customer_X_Address_X_Contacts',array('customer_id','fullname','city'=>'phys_city','tel'=>'central_phone_number','name'))
		->where('fullname LIKE ?','%'.$patten.'%')->where('company_id = ?',$company);
		$select->limit($limit);
		
		$select2 = $db->select()->from('customer',array('customer_id','fullname','city'=>'phys_city','tel'=>'central_phone_number','name'))
		->where('fullname LIKE ?','%'.$patten.'%')->where('company_id = ?',$company);
		$select->limit($limit);
		
		$result = $this->merge($db->fetchAll($select2), $db->fetchAll($select));
			
		return $result;
	}
	
	public function fetchCustomerInfoByquotePatten($patten,$limit=40, $company = DEFAULT_COMPNAY)
	{
		$db = $this->getAdapter();
		$select = $db->select()->from('P21_Customer_X_Address_X_Contacts',array('customer_id','fullname','city'=>'phys_city','tel'=>'central_phone_number','name'))
		->where('name LIKE ?','%'.$patten.'%')->where('company_id = ?',$company);
		$select->limit($limit);
	
		$select2 = $db->select()->from('customer',array('customer_id','fullname','city'=>'phys_city','tel'=>'central_phone_number','name'))
		->where('name LIKE ?','%'.$patten.'%')->where('company_id = ?',$company);
		$select->limit($limit);
	
		$result = $this->merge($db->fetchAll($select2), $db->fetchAll($select));
			
		return $result;
	}
	
	private function merge($array1,$array2)
	{
		$result = null;
		if(is_array($array1))
		{
			if(is_array($array2))
			{
				$result = array_merge($array1,$array2);
			}
			else
			{
				$result = $array1;
			}
		}
		else
		{
			if(is_array($array2))
			{
				$result = $array2;
			}
			else
			{
				$result = null;
			}
			
		}
		
		return $result;
		
	}
	
	public function newcustomer($data)
	{
		$session = Zend_Registry::get('session');
		if($data == null)
		{
			return  false;
		}
		$db = $this->getAdapter();
		$info['name']                = $data['name'];
		$info['Contacts_email']      = $data['Contacts_email'];
		$info['company_id']          = DEFAULT_COMPNAY;
		$info['central_phone_number']       = $data['phone'];
		$info['first_name']                 = $data['first_name'];
		$info['last_name']                  = $data['last_name'];
		$info['phys_address1']              = $data['phys_address1'];
		$info['phys_address2']              = $data['phys_address2'];
		$info['phys_city']                  = $data['phys_city'];
		$info['mail_state']                 = $data['mail_state'];
		$info['mail_postal_code']           = $data['mail_postal_code'];
		$info['phys_country']               = $data['phys_country'];
		$info['fullname']                   = $data['fullname'];
		$info['sale_rep']                   = 'Centura Branches';
		$info['phys_country']               = $data['phys_country'];
		$info['creator']                    = $session->user['id'];
		
		try {
			$db->insert('customer', $info);
		} catch (Exception $e) {
			var_dump($e);
			return false;
		}
		
		$customer = $this->fetchlatestcustomer($info['creator']);

		return $customer['customer_id'];
	}
	
	public function edit($customer_id,$data)
	{
		if($data == null || $customer_id == null)
		{
			return  false;
		}
		$db = $this->getAdapter();
			
		$info['name']                       = $data['name'];
		$info['Contacts_email']             = $data['Contacts_email'];
		$info['company_id']                 = $data['company_id'];
		$info['central_phone_number']       = $data['phone'];
		$info['first_name']                 = $data['first_name'];
		$info['last_name']                  = $data['last_name'];
		$info['phys_address1']              = $data['phys_address1'];
		$info['phys_address2']              = $data['phys_address2'];
		$info['phys_city']                  = $data['phys_city'];
		$info['mail_state']                 = $data['mail_state'];
		$info['mail_postal_code']           = $data['mail_postal_code'];
		$info['phys_country']               = $data['phys_country'];
		$info['sale_rep']                   = $data['sale_rep'];
		$info['phys_country']               = $data['phys_country'];
		
		try {
			$project_id = $db->update('customer', $info,'customer_id ='.$customer_id);
		} catch (Exception $e) {
			return false;
		}
		
		return $project_id;
	}
	
	public function fetchlatestcustomer($creator)
	{
		$db = $this->getAdapter();
		$select = $db->select()->from('customer')->order('added desc');
		if($creator !=null)
		{
			$select->where('creator = ?',$creator);
		}
		return $db->fetchRow($select);
	}
}

