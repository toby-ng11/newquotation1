<?php

namespace Centura\Model;

use Centura\Model\{Customer, ProductProject, Project};

use Zend_Registry;
use Zend_Db_Select;
use Zend_Json;

use Exception;

use DateTime;

use SSP;

require_once('ssp.class.php');
class Quote extends DbTable\Quote
{

	public function save($data)
	{
		$session = Zend_Registry::get('session');
		if ($data == null) {
			return  false;
		}
		$db = $this->getAdapter();
		if (empty($data['contact_id'])) // if customer id is empty add new customer
		{
			$customer = new Customer();
			$data['contact_id'] = $customer->newcustomer($data);
		}
		//add quote
		$info['contact_id']                = $data['contact_id'];
		$info['project_id']                 = $data['project_id'];
		$info['quote_date']                 = date('Y-m-d H:i:s.v');
		if ($data['expire_date'] == null) {
			$data['expire_date'] = date('Y-m-d', mktime(0, 0, 0, date("m"), date("d") + 60, date("Y")));
		} else {
			$info['expire_date'] = DateTime::createFromFormat('Y-m-d', $data['expire_date'])->format('Y-m-d');
		}
		$info['quote_type_id']              = $data['quote_type_id'];
		$info['quote_segment']              = $data['quote_segment'];
		$info['sales_id']                   = $session->user['id'];
		//		$info['quote_approval']             = $data['quote_approval'];
		$info['note']                       = $data['note'];
		$info['status']                     = 1;
		$info['delete_flag']                = 'N';
		if ($data['ship_required_date'] != null) {
			$info['ship_required_date']         = DateTime::createFromFormat('Y-m-d', $data['ship_required_date'])->format('Y-m-d');
		} else {
			$info['ship_required_date'] = NULL;
		}

		if ($data['arch'] != null) {
			$info['arch']                       = $data['arch'];
		}

		try {

			$db->insert('quote', $info);
			$newQuoteID = $db->lastInsertId('quote', 'quote_id');

			$this->updateQuoteInfo($newQuoteID);

			$item = new ItemsProject();
			$itemList = $item->fetchallitems($data['project_id']);

			$item_id_list = array();

			$products = new ProductProject();
			foreach ($itemList as $item) {
				$products->add($item, $newQuoteID);
				$item_id_list[] = $item["product_id"];
			}

			$project = new Project();
			$project->log($data['project_id'], 'Quote Add', $newQuoteID, implode(", ", $item_id_list), $data['note']);

			return $newQuoteID;
		} catch (Exception $e) {
			error_log(print_r($e));
			return false;
		}
	}

	public function edit($data, $quote_id)
	{
		$session = Zend_Registry::get('session');
		if ($data == null || $quote_id == null) {
			return  false;
		}
		$db = $this->getAdapter();

		if (empty($data['customer_id'])) // if customer id is empty add new customer
		{
			$customer = new Customer();
			$data['customer_id'] = $customer->newcustomer($data);
		}
		//else {
		//	$customer = new Customer();
		//	$data['customer_id'] = $customer->edit($data['customer_id'], $data);
		//}
		//add quote
		$info['contact_id']                = $data['contact_id'];
		$info['project_id']                 = $data['project_id'];
		//$info['quote_date']                 = date('Y-m-d H:i:s', strtotime($data['quote_date']));
		if ($data['expire_date'] == null || strtotime($data['expire_date']) < 1000) //fix 1969-12-31
		{
			$data['expire_date'] = date('Y-m-d', mktime(0, 0, 0, date("m"), date("d") + 60, date("Y")));
		} else {
			$info['expire_date']                = DateTime::createFromFormat('Y-m-d', $data['expire_date'])->format('Y-m-d');
		}
		$info['quote_type_id']              = $data['quote_type_id'];
		$info['quote_segment']              = $data['quote_segment'];
		//$info['sales_id']                   = $session->user['id'];
		$info['quote_approval']             = $data['quote_approval'];
		$info['note']                       = $data['note'];
		//$info['status']                     = 1;
		$info['term']                       = $data['credit_term'];
		$info['lead_time']                  = $data['lead_time'];
		if ($data['ship_required_date'] != null) {
			$info['ship_required_date']         = DateTime::createFromFormat('Y-m-d', $data['ship_required_date'])->format('Y-m-d');
		} else {
			$info['ship_required_date'] = NULL;
		}

		if ($data['arch'] != null) {
			$info['arch']                       = $data['arch'];
		}

		try {
			$db->update('quote', $info, 'quote_id =' . $quote_id);
			$project = new Project();
			$project->log($data['project_id'], 'Quote Edit', $quote_id, null, $data['note']);
		} catch (Exception $e) {
			echo $e->getMessage();
			return false;
		}

		//edit products //legacy
		//$products = new ProductProject();
		//$products->edit($data['item'], $quote_id);

		return $quote_id;
	}

	public function fetchquotebyid($quote_id)
	{
		if ($quote_id == null) {
			return false;
		}

		$db = $this->getAdapter();

		$select = $db->select()
			->from('quote')
			->where('quote_id = ?', $quote_id);

		return $db->fetchRow($select);
	}

	public function fetchlatestquote($sales_id)
	{
		$db = $this->getAdapter();
		$select = $db->select()
			->from('quote')
			->order('added desc');

		if ($sales_id != null) {
			$select->where('sales_id = ?', $sales_id);
		}
		return $db->fetchRow($select);
	}

	public function fetchTotalProjectQuotes($project_id)
	{
		if ($project_id == null) {
			return  false;
		}

		$db = $this->getAdapter();
		$select = $db->select()
			->from('quote', 'quote_id')
			->where('project_id =?', $project_id);

		$result = $db->fetchAll($select);

		return count($result);
	}

	public function refresh($quote_id)
	{
		if ($quote_id == null) {
			return  false;
		}
	}

	public function updateQuoteInfo($quote_id) // update Quote # and Job Name
	{
		if ($quote_id == null) {
			return  false;
		}
		$quote = $this->fetchquotebyid($quote_id);
		$project = new Project();

		$project_info = $project->fetchbyid($quote['project_id']);
		$total = $this->fetchTotalProjectQuotes($quote['project_id']);

		$data['quote_no'] = $project_info['quote_no'] . '_' . sprintf('%05d', ($total + 1));
		$data['job_name'] = substr($project_info['project_name'], 0, 40);
		$data['po_number'] = substr($quote_id . ' - P2Q', 0, 40);

		$db = $this->getAdapter();

		try {
			$db->update('quote', $data, 'quote_id =' . $quote_id);
		} catch (Exception $e) {
			return false;
		}
	}

	public function remove($quote_id)
	{
		if ($quote_id == null) {
			return  false;
		}
		$db = $this->getAdapter();

		//$data['status'] = 0; // legacy
		$data['delete_flag'] = 'Y';

		try {
			$db->update('quote', $data, 'quote_id =' . $quote_id);
		} catch (Exception $e) {
			error_log($e);
			return false;
		}
		return true;
	}

	public function fetchstatus()
	{
		$db = $this->getAdapter();
		$select = $db->select()
			->from('status')
			->where('delete_flag = ?', 'N')
			->order('status_desc asc');

		return $db->fetchAll($select);
	}

	public function fetchseg()
	{
		$db = $this->getAdapter();
		$select = $db->select()
			->from('market_segment')
			->where('delete_flag = ?', 'N')
			->order('market_segment_desc asc');

		return $db->fetchAll($select);
	}
	public function fetchsepc($company = DEFAULT_COMPNAY)
	{
		$db = $this->getAdapter();
		$select = $db->select()->distinct()
			->from('specifier')
			->where('delete_flag = ?', 'N')
			->order('specifier_name asc');

		if ($company != null) {
			$select->where('company_id = ?', $company);
		}

		return $db->fetchAll($select);
	}

	public function fetchsepcloc($spec_id)
	{
		if ($spec_id == null) {
			return false;
		}

		$db = $this->getAdapter();
		$select = $db->select()
			->from('quote_specifier')
			->where('uid = ?', $spec_id);

		return $db->fetchRow($select);;
	}

	public function fetchquotetype()
	{
		$db = $this->getAdapter();
		$select = $db->select()->distinct()->from('quote_type')->where('DeleteFlag = ?', 'N')->order('type asc');

		return $db->fetchAll($select);
	}

	public function fetchbyowner($owner, $status = 1)
	{
		if ($owner == null) {
			return  false;
		}
		$db = $this->getAdapter();
		$select = $db->select()
			->from('quote')
			->join('project', 'project.project_id = quote.project_id', 'project_name')
			->join('quote_status', 'quote_status.uid=project.status', array('status_name' => 'Status'))
			->where('sales_id = ?', $owner)
			->where('quote.status = ?', $status)
			->where('project.delete_flag =?', 'N')
			->order('quote_id desc');

		return $db->fetchAll($select);
	}

	public function fetchrelated($owner, $status = 1)
	{
		if ($owner == null) {
			return  false;
		}
		$db = $this->getAdapter();
		$selectedField = array(
			'quote_id',
			'quote_id_ext',
			'project_id',
			'project_name',
			//'customer', #todo add contact and customer
			'quote_date',
			'expire_date',
			'ship_required_date',
			'project_status',
			'quote_status'
		);

		$select = $db->select()
			->from('p2q_view_quote_x_project', $selectedField)
			//->where('sales_id = ?', $owner) //#TODO: add salesrep_id
			->orWhere('owner_id = ?', $owner)
			->orWhere('architect_id = ?', $owner)
			->order('quote_id desc');

		$result = $db->fetchAll($select);
		return $result;
	}

	public function fetchrelatedJson($owner, $status = 1)
	{
		if ($owner == null) {
			return  false;
		}
		$db = $this->getAdapter();

		$selectedField = array(
			'quote_id',
			'quote_id_ext',
			'project_id',
			'project_name',
			//'customer', #todo add contact and customer
			'quote_date',
			'expire_date',
			'ship_required_date',
			'project_status',
			'quote_status'
		);

		$select = $db->select()
			->from('p2q_view_quote_x_project', $selectedField)
			//->where('sales_id = ?', $owner) //#TODO: add salesrep_id
			->orWhere('owner_id = ?', $owner)
			->orWhere('architect_id = ?', $owner)
			->order('quote_id desc');

		$result = $db->fetchAll($select);
		return Zend_Json::encode($result);
	}

	public function fetchtotal()
	{
		$db = $this->getAdapter();
		$select = $db->select()
			->from('quote')
			->order('quote_id desc')
			->join('project', 'project.project_id = quote.project_id', 'project_name')
			->join('quote_status', 'quote_status.uid=project.status', array('status_name' => 'Status'))
			->where('quote.status =?', 1)
			->where('project.delete_flag =?', 'N');

		return $db->fetchAll($select);
	}

	public function fetchQuoteJson()
	{
		$db = $this->getAdapter();

		$select = $db->select()->from('quote')
			->order('quote_id desc')
			->join('project', 'project.project_id = quote.project_id', 'project_name')
			->join('quote_status', 'quote_status.uid=project.status', array('status_name' => 'Status'))
			->join('quote_market_segment', 'quote_market_segment.uid = quote.quote_segment', array('segment' => 'Market_Segment'))
			->where('quote.status =?', 1)
			->where('project.delete_flag =?', 'N');

		//$select->limit($limit);

		return Zend_Json::encode($db->fetchAll($select));
	}

	// Enable server-side processing for all tables (experimental)
	public function getAdminQuotes()
	{
		$dbDetails = $this->getAdapter();

		//DB table to use
		$table = "p2q_view_quote_x_project";

		// Table's primary key
		$primaryKey = 'quote_id';

		$columns = array(
			array('db' => 'quote_id', 			 'dt' => 'quote_id'),
			array('db' => 'project_name',  	 'dt' => 'project_name'),
			array('db' => 'market_segment_desc',     'dt' => 'market_segment_desc'),
			array('db' => 'quote_date',         'dt' => 'quote_date'),
			array('db' => 'expire_date',        'dt' => 'expire_date'),
			array('db' => 'ship_required_date', 'dt' => 'ship_required_date'),
			array('db' => 'project_status', 			 'dt' => 'project_status'),
			array('db' => 'quote_status', 	 'dt' => 'quote_status'),
		);

		echo Zend_Json::encode(
			SSP::complex($_POST, $dbDetails, $table, $primaryKey, $columns)
		);
	}

	public function fetchlogbyid($quote_id)
	{
		if ($quote_id == null) {
			return false;
		}
		$db = $this->getAdapter();

		$select = $db->select()
			->from('project_log')
			->join('project', 'project.project_id = project_log.project_id', array(
				'address' => 'project_location_address',
				'project_name'
			))
			->where('project_log.quote_id = ?', $quote_id)->order('added desc');

		return $db->fetchAll($select);
	}
	public function fetchlogbyowner($owner)
	{
		if ($owner == null) {
			return false;
		}
		$db = $this->getAdapter();

		$select = $db->select()
			->from('project_log')
			->join('project', 'project.project_id = project_log.project_id', array(
				'address' => 'project_location_address',
				'project_name'
			))
			->join('quote', 'quote.project_id = project.project_id')
			->where('quote.sales_id = ?', $owner)
			->order('project_log.added desc');

		return $db->fetchAll($select);
	}

	public function fetchwaiting($status = 1, $is_admin = false, $Json = false, $default_company = DEFAULT_COMPNAY)
	{
		$db = $this->getAdapter();
		$select = $db->select()
			->from('p2q_view_quote_x_project')
			->order('quote_id desc');

		$select->where('quote_status = ?', $status); // not delete and waiting approve

		if ($is_admin == false) {
			$select->where('centura_location_id = ?', $default_company);
		}
		$result = $db->fetchAll($select);

		if ($Json) {
			return Zend_Json::encode($result);
		} else {
			return $result;
		}
	}

	public function fetchApprovalQuotes($approvalStatus = 1, $isAdmin = false, $default_company = DEFAULT_COMPNAY)
	{
		$dbDetails = $this->getAdapter();

		$table = "quotes_approval_view";

		$primaryKey = 'quote_id';

		$columns = array(
			array('db' => 'quote_id', 			 'dt' => 'quote_id'),
			array('db' => 'project_name',  	 'dt' => 'project_name'),
			array('db' => 'arch_name',			 'dt' => 'arch'),
			array('db' => 'customer',			 'dt' => 'customer'),
			array('db' => 'sale_name',			 'dt' => 'sale_name'),
			array('db' => 'Market_Segment',	 'dt' => 'Market_Segment'),
			array('db' => 'quote_date',		 'dt' => 'quote_date'),
			array('db' => 'expire_date',		 'dt' => 'expire_date'),
			array('db' => 'ship_required_date', 'dt' => 'ship_required_date'),
			array('db' => 'status_name',		 'dt' => 'status_name'),
		);

		if ($isAdmin) {
			$where = 'approve_status = ' . $approvalStatus;
		} else {
			$where = 'approve_status = ' . $approvalStatus . ' AND default_company = \'' . $default_company . '\'';
		}

		echo Zend_Json::encode(
			SSP::complex($_POST, $dbDetails, $table, $primaryKey, $columns, $where)
		);
	}


	public function fetchleadtimes($language_id = 0)
	{
		$db = $this->getAdapter();
		$select = $db->select()
			->from('lead_time')
			->where('language_id = ?', $language_id)
			->order('days asc');

		return $db->fetchAll($select);
	}

	public function fetchuserterm($customer_id)
	{
		if ($customer_id == null || $customer_id > 90000) // not user defined 
		{
			return null;
		}

		$db = $this->getAdapter();
		$select = $db->select()
			->from('P21_Customer', null)
			->join('P21_Terms', 'P21_Terms.terms_id = P21_Customer.terms_id', 'terms_desc');

		$result =  $db->fetchRow($select);

		if ($result['terms_desc'] != 'Net 30' && $result['terms_desc'] != 'COD') {
			$result['terms_desc'] = 'Net 30';
		}

		return $result['terms_desc'];
	}

	public function fetchallterms()
	{
		//$array[0] = array('terms_desc'=>'COD 30');
		//$array[1] = array('terms_desc'=>'COD');
		$db = $this->getAdapter();
		$select = $db->select()
			->from('P21_Terms', 'terms_desc')
			->order('terms_desc asc')
			->where("P21_Terms.terms_desc IN ('COD','Net 30')");

		return $db->fetchAll($select);;
	}

	public function fetcsv($company = null, $day = 1)
	{
		$internalCustomers = array(101, 102, 103, 104, 105, 106, 107, 108, 109);

		$db = $this->getAdapter();
		$select = $db->select()
			->from('quote')
			->order('quote_id desc')
			->joinLeft('project', 'project.project_id = quote.project_id', 'project_name')
			->joinLeft('P21_Customer_X_Address_X_Contacts', 'P21_Customer_X_Address_X_Contacts.contact_id = quote.contact_id', 'customer_id')
			->joinLeft('P21_Users', 'quote.arch = P21_Users.id', array(
				'arch_rep' => 'P21_Users.name'
			))
			->where('quote.status = ?', 1)
			->where('quote.delete_flag = ?', 'N')
			->where('quote.approve_status = ?', 10);
			//->where('quote.customer_id < ?', 900000)
			//->where('P21_Customer_X_Address_X_Contacts.duplicate_customer_id NOT IN (?)', $internalCustomers);

		if ($company != null) {
			$select->where('quote_no LIKE ? ', $company . '%');
		}

		$select->where('quote.approve_date >= ?', date('Y-m-d', strtotime('-' . $day . ' days')));
		$select->where('quote.approve_date < ?', date('Y-m-d'));

		$result = $db->fetchAll($select);

		$csv = array();

		foreach ($result as $r) {
			$csv[$r['quote_id']] = array(
				'quote_id' => $r['quote_id'],
				'company' => substr($r['quote_no'], 0, 3),
				'customer' => $r['customer_id'],
				'contact' => $r['contact_id'],
				'job_name' => $r['job_name'],
				'note' => $r['arch_rep'] . ' - ' . $r['note'],
				'po_number' => $r['po_number'],
				'taker' => $r['sales_id'],
				'order_date' => DateTime::createFromFormat('Y-m-d H:i:s.v', $r['approve_date'])->format('m/d/Y'),
				'requested_date' => DateTime::createFromFormat('Y-m-d H:i:s.v', $r['ship_required_date'])->format('m/d/Y'),
				'expire_date' => DateTime::createFromFormat('Y-m-d H:i:s.v', $r['expire_date'])->format('m/d/Y')
			);
		}

		return $csv;
	}

	public function fetchcsvitems($company = null, $day = 1)
	{
		$internalCustomers = array(101, 102, 103, 104, 105, 106, 107, 108, 109);

		$db = $this->getAdapter();

		$select = $db->select()->from('quotes_products')
			->joinLeft('P21_Inv_Mast', 'quotes_products.product_id = P21_Inv_Mast.item_id', 'item_desc')
			->joinLeft('quote', 'quote.quote_id = quotes_products.quote_id', array('approve_date'))
			->joinLeft('P21_Customer_X_Address_X_Contacts', 'P21_Customer_X_Address_X_Contacts.contact_id=quote.contact_id', array('p21_customer_id' => 'customer_id'))
			->order('quotes_products.quote_id desc')
			->order('quotes_products.sort_id asc')
			->where('quote.status = ?', 1)
			->where('quote.delete_flag = ?', 'N')
			->where('quote.approve_status = ?', 10)
			->where('quotes_products.status = 1');
			//->where('quote.customer_id  < ?', 900000)
			//->where('P21_Customer_X_Address_X_Contacts.duplicate_customer_id NOT IN (?)', $internalCustomers);
		if ($company != null) {
			$select->where('quote.quote_no LIKE ? ', $company . '%');
		}

		$select->where('quote.approve_date >= ?', date('Y-m-d', strtotime('-' . $day . ' days')));
		$select->where('quote.approve_date < ?', date('Y-m-d'));

		$result =  $db->fetchAll($select);

		$csv = array();

		foreach ($result as $r) {
			/* fix duplicate sort id issue */
			if (isset($sort[$r['quote_id']])) {
				$sort[$r['quote_id']]++;
			} else {
				$sort[$r['quote_id']] = 1;
			}
			/**end fix*/
			$csv[$r['quote_id']][] = array(
				'item_id' => $r['product_id'],
				'qty' => $r['qty'],
				'uom' => $r['uom'],
				'unit_price' => $r['unit_price'],
				'quote_id' => $r['quote_id'],
				'sort_id' => $sort[$r['quote_id']],
				'note' => trim(preg_replace('/\s+/', ' ', $r['note'])),
				'approve_date' => DateTime::createFromFormat('Y-m-d H:i:s.v', $r['approve_date'])->format('m/d/Y')
			);
		}

		return $csv;
	}

	public function fetchQuoteByProjectId($project_id)
	{
		if ($project_id == null) {
			return  false;
		}

		$db = $this->getAdapter();

		$selectedField = array(
			'quote.quote_id',
			'quote.quote_date',
			'quote.expire_date',
			'quote.ship_required_date',
			'quote.approve_status'
		);

		$select = $db->select()
			->from('quote', $selectedField)
			->joinLeft('quote_market_segment', 'quote_market_segment.uid = quote.quote_segment', 'Market_Segment')
			->joinLeft('P21_Users', 'quote.arch = P21_Users.id', 'name')
			->joinLeft('view_quote_x_oe', 'view_quote_x_oe.quote_id = quote.quote_id', 'order_no')
			->where('quote.status =?', 1) // legacy
			->where('quote.delete_flag =?', 'N')
			->where('project_id = ?', $project_id)
			->order('quote_id desc');

		$result = $db->fetchAll($select);

		return Zend_Json::encode($result);
	}

	public function fetchP21OrderNumber($quote_id) {
		if ($quote_id == null) {
			return  false;
		}

		$db = $this->getAdapter();

		$select = $db->select()
			->from('view_quote_x_oe', 'order_no')
			->where('quote_id = ?', $quote_id);
	
		$result = $db->fetchRow($select);
		return $result;
	}
}
