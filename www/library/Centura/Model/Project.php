<?php

namespace Centura\Model;

use Zend_Registry;
use Zend_Json;

use Exception;

class Project extends DbTable\Project
{
    
	public function save($data)
	{
	    if($data == null)
	    {
	        return  false;
	    }
	    $db = $this->getAdapter();
	    
	    $info['market_segment']      = $data['market_segment'];
	    $info['centura_location_id'] = $data['location'];
	    $info['owner']               = $data['owner'];
	    $info['project_location_address'] = $data['project_location_address'];
	    $info['reed']                     = $data['reed'];
	    $info['general_contractor_id']    = $data['gerneral_contractor_id'];
	    $info['awarded_sub_contracotr_id']  = $data['awarded_contractor_id'];
	    $info['create_date']                = date('Y-m-d h:i:s');
	    if(!empty($data['required_date']))
	    {
	    	$info['required_date']              = date('Y-m-d h:i:s',strtotime($data['required_date']));
	    }
	    else {
	    	$info['required_date']              = date('Y-m-d h:i:s');
	    }
	    
	    if(!empty($data['due_date']))
	    {
	    	$info['due_date']                   = date('Y-m-d h:i:s',strtotime($data['due_date']));
	    }
	    else
	    {
	    	$info['due_date']                   = date('Y-m-d h:i:s');
	    }
	    
	    
	    $info['status']                     = $data['status'];
	    $info['architect']                  = $data['architect']; // null need check
	    $info['specifiler']                  = $data['specifiler'];// null need check
	    $info['deleted']                     = 'N';
	    $info['project_name']               = $data['project_name'];
		$info['worksheet_assign'] = $data['worksheet_assign'];
	    
	  	if($info['architect'] == null || $info['architect'] == 0   ) // no id or not match
	    {
	    	
	    	$info['architect'] = $this->addspec($data['architect_name']);
	    	
	    }
	    else 
	    {
	    	if(strtolower($this->fetchspecbyid($info['architect'])) == strtolower($data['architect_name']))// same name already exitst
	    	{
	    		    		
	    		$result = $this->fetchspec($info['architect']);
	    		$info['architect'] =$result['uid'];
	    	}
	    	
	    }
	     
	    if($info['specifiler'] == null || $info['specifiler'] == 0   ) // no id
	    {
	    	
	    	$info['specifiler'] = $this->addspec($data['specifiler_name']);
	    	
	    	
	    }
	    else
	    {
	    	if(strtolower($this->fetchspecbyid($info['specifiler'])) == strtolower($data['specifiler_name']))// same name already exitst
	    	{
	    		$result = $this->fetchspec($data['specifiler']);
	    		$info['specifiler'] =$result['uid'];
	    	}
	    }
	    
	    try {
	    	$project_id = $db->insert('project', $info);
	    } catch (Exception $e) {
	    	var_dump($e);
	    }
	    
	    $result = $this->fetchlatest($info['owner']);
	    $project_id = $result['project_id'];
	    if($project_id != null) // update
	    {
	    	$data = null;
	    	$data['quote_no'] = DEFAULT_COMPNAY.'_'.$project_id;
	    	if($result['project_name'] == null) // no name 
	    	{
	    		$data['project_name'] = DEFAULT_COMPNAY.'_'.$project_id;
	    	}
	    	$this->updateproject($project_id, $data);
	    }
	    $this->log($project_id,'Project Create',null,null,serialize($info));
	    return $project_id;
	}
	
	public function updateproject($project_id,$data)
	{
		if($project_id == null)
		{
			return false;
		}
		else
		{
			$db = $this->getAdapter();
			try {
				$db->update('project', $data,'project_id ='.$project_id);
			} catch (Exception $e) {
				var_dump($e);
			}
		}
	}
	
	public function fetchlatest($owner = null)
	{
		$db = $this->getAdapter();
		$select = $db->select()->from('project')->order('project_id desc');
		if($owner !=null)
		{
			$select->where('owner = ?',$owner);
		}
		return $db->fetchRow($select);
		
	}
	
	public function fetchbyowner($owner = null,$count = 5,$offset =0)
	{
		if($owner ==null)
		{
			return  false;
		}
		$db = $this->getAdapter();
		$select = $db->select()->from('project')->order('project_id desc')->join('P21_Location', 'centura_location_id = P21_Location.location_id','company_id')
			->join('quote_status','quote_status.uid=project.status',array('status_name'=>'Status'))
			->join('quote_market_segment', 'quote_market_segment.uid = project.market_segment',array('segment'=>'Market_Segment'))
			->join('quote_specifier','quote_specifier.uid = project.specifiler',array('Specifier_name'=>'quote_specifier.Specifier'));
		
		$select->where('owner = ?',$owner)->where('project.deleted =?','N');

		return $db->fetchAll($select);	
	}

	public function fetchbyownerJson($owner = null,$count = 5,$offset =0)
	{
		if($owner ==null)
		{
			return  false;
		}
		$db = $this->getAdapter();
		$select = $db->select()->from('project')
			->order('project_id desc')
			->join('P21_Location', 'centura_location_id = P21_Location.location_id','company_id')
			->join('quote_status','quote_status.uid=project.status', array(
				'status_name'=>'Status'))
			->join('quote_market_segment', 'quote_market_segment.uid = project.market_segment', array(
				'segment'=>'Market_Segment'))
			->join('quote_specifier','quote_specifier.uid = project.specifiler', array(
				'Specifier_name'=>'quote_specifier.Specifier'))
		    ->where('owner = ?',$owner)
			->where('project.deleted =?','N');

		return Zend_Json::encode($db->fetchAll($select));	
	}

	public function fetchbyassign($owner = null,$count = 5,$offset =0)
	{
		if($owner ==null)
		{
			return  false;
		}
		$db = $this->getAdapter();
		$select = $db->select()->from('project')
			->order('project_id desc')
			->join('P21_Location', 'centura_location_id = P21_Location.location_id','company_id')
			->join('quote_status','quote_status.uid=project.status', array(
				'status_name'=>'Status'))
			->join('quote_market_segment', 'quote_market_segment.uid = project.market_segment', array(
				'segment'=>'Market_Segment'))
			->join('quote_specifier','quote_specifier.uid = project.specifiler', array(
				'Specifier_name'=>'quote_specifier.Specifier'))
		    ->where('worksheet_assign = ?',$owner)
			->where('project.deleted =?','N');

		return $db->fetchAll($select);	
	}

	public function fetchbyassignJson($owner = null,$count = 5,$offset =0)
	{
		if($owner ==null)
		{
			return  false;
		}
		$db = $this->getAdapter();
		$select = $db->select()->from('project')
			->order('project_id desc')
			->join('P21_Location', 'centura_location_id = P21_Location.location_id','company_id')
			->join('quote_status','quote_status.uid=project.status', array(
				'status_name'=>'Status'))
			->join('quote_market_segment', 'quote_market_segment.uid = project.market_segment', array(
				'segment'=>'Market_Segment'))
			->join('quote_specifier','quote_specifier.uid = project.specifiler', array(
				'Specifier_name'=>'quote_specifier.Specifier'))
		    ->where('worksheet_assign = ?',$owner)
			->where('project.deleted =?','N');

		return Zend_Json::encode($db->fetchAll($select));	
	}
	
	public function fetchothers($owner =null,$company_id = DEFAULT_COMPNAY_ID)
	{
		if($owner ==null)
		{
			return  false;
		}
		$db = $this->getAdapter();
		$select = $db->select()->from('project')->order('project_id desc')->join('P21_Location', 'centura_location_id = P21_Location.location_id','company_id')
			->join('quote_status','quote_status.uid=project.status',array('status_name'=>'Status'))
			->join('quote_market_segment', 'quote_market_segment.uid = project.market_segment',array('segment'=>'Market_Segment'))
			->join('quote_specifier','quote_specifier.uid = project.specifiler',array('Specifier_name'=>'quote_specifier.Specifier'));
		
		$select->where('owner != ?',$owner)->where('project.deleted =?','N');;
		$select->where('quote_status.uid != 13');
		$select->where('P21_Location.company_id = ?',$company_id);


		return $db->fetchAll($select);	
	}
	
	public function fetchothersJson($owner =null, $company_id = DEFAULT_COMPNAY_ID)
	{
		if($owner ==null)
		{
			return  false;
		}
		$db = $this->getAdapter();
		$select = $db->select()->from('project')->order('project_id desc')->join('P21_Location', 'centura_location_id = P21_Location.location_id','company_id')
			->join('quote_status','quote_status.uid=project.status',array('status_name'=>'Status'))
			->join('quote_market_segment', 'quote_market_segment.uid = project.market_segment',array('segment'=>'Market_Segment'))
			->join('quote_specifier','quote_specifier.uid = project.specifiler',array('Specifier_name'=>'quote_specifier.Specifier'));
		
		$select->where('owner != ?',$owner)->where('project.deleted =?','N');;
		$select->where('quote_status.uid != 13');
		$select->where('P21_Location.company_id = ?',$company_id);


		return Zend_Json::encode($db->fetchAll($select));
	}

	public function fetchallproject($owner = null)
	{
		$db = $this->getAdapter();
		$select = $db->select()->from('project')->order('project_id desc')->join('P21_Location', 'centura_location_id = P21_Location.location_id','company_id')
			->join('quote_status','quote_status.uid=project.status',array('status_name'=>'Status'))
			->join('quote_market_segment', 'quote_market_segment.uid = project.market_segment',array('segment'=>'Market_Segment'))->where('project.deleted =?','N')
			->join('quote_specifier','quote_specifier.uid = project.specifiler',array('Specifier_name'=>'quote_specifier.Specifier'));
		
		if($owner != null)
		{
			$select->where('owner = ?',$owner);
		}
		return $db->fetchAll($select);
	}

	public function fetchallprojectJson($owner = null) {
		$db = $this->getAdapter();
		$select = $db->select()->from('project')->order('project_id desc')->join('P21_Location', 'centura_location_id = P21_Location.location_id','company_id')
			->join('quote_status','quote_status.uid=project.status',array('status_name'=>'Status'))
			->join('quote_market_segment', 'quote_market_segment.uid = project.market_segment',array('segment'=>'Market_Segment'))->where('project.deleted =?','N')
			->join('quote_specifier','quote_specifier.uid = project.specifiler',array('Specifier_name'=>'quote_specifier.Specifier'));
		
		if($owner != null)
		{
			$select->where('owner = ?',$owner);
		}
		return Zend_Json::encode($db->fetchAll($select));
	}
	
	public function fetchbyid($project_id = null)
	{
		if($project_id == null)
		{
			return false;
		}
		
		$db = $this->getAdapter();
		$select = $db->select()->from('project')->where('project_id = ?',$project_id)
				->join('P21_Users','P21_Users.id = project.owner',array('owner_name'=>'P21_Users.name'))
				->join('quote_status','quote_status.uid=project.status',array('status_name'=>'Status'));
		$result = $db->fetchRow($select);
		return $result;	
	}

	public function edit($data,$project_id)
	{
		 if($data == null || $project_id == null)
	    {
	        return  false;
	    }
	    $db = $this->getAdapter();
	    
	    $info['market_segment']      = $data['market_segment'];
	    $info['centura_location_id'] = $data['location'];
	    $info['owner']               = $data['owner'];
	    $info['project_location_address'] = $data['project_location_address'];
	    $info['reed']                     = $data['reed'];
	    $info['general_contractor_id']    = $data['gerneral_contractor_id'];
	    $info['awarded_sub_contracotr_id']  = $data['awarded_contractor_id'];
	    //$info['create_date']                = date('Y-m-d h:i:s');
	    $info['required_date']              = date('Y-m-d h:i:s',strtotime($data['required_date']));
	    $info['due_date']                   = date('Y-m-d h:i:s',strtotime($data['due_date']));
	    $info['status']                     = $data['status'];
	    $info['architect']                  = $data['architect'];
	    $info['specifiler']                 = $data['specifiler'];
	    $info['deleted']                     = 'N';
	    $info['quote_no']                   = $data['quote_no'];
	    $info['project_name']                = $data['project_name'];
		$info['worksheet_assign']           = $data['worksheet_assign'];
	    
		if($info['architect'] == null || $info['architect'] == 0 || strtolower($this->fetchspecbyid($info['architect'])) != strtolower($data['architect_name'])) // no id or not match
	    {
	    	
	    	$info['architect'] = $this->addspec($data['architect_name']);
	    	
	    }
	    else 
	    {
	    	if(strtolower($this->fetchspecbyid($info['architect'])) == strtolower($data['architect_name']))// same name already exitst
	    	{
	    		    		
	    		$result = $this->fetchspec($info['architect']);
	    		$info['architect'] =$result['uid'];
	    	}
	    	
	    }
	     
	    if($info['specifiler'] == null || $info['specifiler'] == 0  || strtolower($this->fetchspecbyid($info['specifiler'])) != strtolower($data['specifiler_name'])) // no id
	    {	
	    	$info['specifiler'] = $this->addspec($data['specifiler_name']);
	    }
	    else
	    {
	    	if(strtolower($this->fetchspecbyid($info['specifiler'])) == strtolower($data['specifiler_name']))// same name already exitst
	    	{
	    		
	    		$result = $this->fetchspec($data['specifiler']);
	    		$info['specifiler'] =$result['uid'];
	    	}
	    }
	    
	    try {
	    	$db->update('project', $info,'project_id ='.$project_id);
	    } catch (Exception $e) {
	    	error_log($e->getMessage());
	    	return  false;
	    }
	    
	    $this->log($project_id,'Project Update',null,null,json_encode($info));
	    
	    return true;

	}
	
	public function remove($project_id)
	{
		if($project_id == null)
		{
			return  false;
		}
		$db = $this->getAdapter();
		
		$data['status'] = 13;
		
		try {
			$db->update('project', $data,'project_id ='.$project_id);
		} catch (Exception $e) {
			var_dump($e);
			return  false;
		}
		$this->log($project_id,'Project Delete');
		return true;

	}
	
	public function log($project_id,$action='default',$quote_id = null,$item_id= null,$note= null)
	{
		if($project_id == null)
		{
			return false;
		}
		$session =  Zend_Registry::get('session');
		$db = $this->getAdapter();
		
		$data['project_id']= $project_id;
		$data['quote_id']  = $quote_id;
		$data['action']    = $action;
		$data['item_id']   = $item_id;
		$data['note']      = $note;
		$data['added']     = date('Y-m-d h:i:s');
		$data['user_id']   = $session->user['id'];
		
		try {
			$db->insert('project_log', $data);
		} catch (Exception $e) {
			var_dump($e);exit;
			return  false;
		}
		
		return true;
	}
	
	public function fetchlogbyid($project_id)
	{
		if($project_id == null)
		{
			return false;
		}
		$db = $this->getAdapter();
		
		$select =$db->select()->from('project_log')->join('project', 'project.project_id = project_log.project_id',array('address'=>'project_location_address','project_name'))
			->where('project_log.project_id = ?',$project_id)->order('added desc');
		
		return $db->fetchAll($select);
		
	}
	
	public function fetchlogbyowner($owner)
	{
		if($owner == null)
		{
			$session =  Zend_Registry::get('session');
			$owner = $session->user['id'];
		}
		$db = $this->getAdapter();
	
		$select =$db->select()->from('project_log')->join('project', 'project.project_id = project_log.project_id',array('address'=>'project_location_address','project_name'))
			->where('project.owner = ?',$owner)->order('added desc');
		return $db->fetchAll($select);
	
	}
	
	public function addspec($spec,$company = DEFAULT_COMPNAY)
	{
		if($spec == null)
		{
			return false;
		}
		
		$db = $this->getAdapter();
		
		$info['Specifier'] = $spec;
    	$info['DeleteFlag'] = 'N';
    	$info['Company_ID'] = $company;
    	
    	try {
    		$db->insert('quote_specifier', $info);
    	} catch (Exception $e) {
    		//return false;
    	}
    	
    	$select =$db->select()->from('quote_specifier','uid')->where('Specifier = ?',$spec)->where('Company_ID = ?',$company);
    	
    	$result = $db->fetchRow($select);
    	
    	return $result['uid'];
    	
	}
	
	public function fetchspecbyid($uid)
	{
		if($uid == null)
		{
			return false;
		}
		$db = $this->getAdapter();
		
		$select =$db->select()->from('quote_specifier')->where('uid = ?',$uid);
		
		$result = $db->fetchRow($select);
		 
		return $result['Specifier'];
		
	}
	
	public function fetchspec($uid)
	{
		if($uid == null)
		{
			return false;
		}
		$db = $this->getAdapter();
	
		$select =$db->select()->from('quote_specifier')->where('uid = ?',$uid);
	
		$result = $db->fetchRow($select);
			
		return $result;
	
	}
	
	public function fetchspecbypattern($patten,$company = DEFAULT_COMPNAY,$limit=20)
	{
		$db = $this->getAdapter();
		
		$select =$db->select()->from('quote_specifier',array('uid','Specifier'))->where('Company_ID =?',$company)->where('Specifier LIKE ?','%'.$patten.'%')->where('DeleteFlag = ?','N')->limit(20);
		
		return $db->fetchAll($select);
		
	}
	
}

