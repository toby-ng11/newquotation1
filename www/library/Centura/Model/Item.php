<?php

namespace Centura\Model;

class Item extends DbTable\Item
{
	public function fetchItemByPatten($patten, $limit = 20, $company = DEFAULT_COMPNAY_ID)
	{
		$db = $this->getAdapter();

		$term = "'%$patten%'";
		$select = $db->select()
			->from('P21_Items', ['item_id', 'item_desc', 'location_id'])
			->where('location_id =?', $company)
			->where("item_id LIKE $term OR item_desc LIKE $term")
			->order('item_id asc');
		$select->limit($limit);

		return $db->fetchAll($select);
	}

	public function fetchUomByItemId($item_id, $company = DEFAULT_COMPNAY_ID)
	{
		if ($item_id == null) {
			return null;
		}
		$db = $this->getAdapter();
		$select = $db->select()
			->from('P21_Items_x_uom', ['uom' => 'unit_of_measure'])
			->where('location_id =?', $company)
			->where('item_id = ?', $item_id)
			->order('default_selling_unit desc');

		return $db->fetchAll($select);
	}

	public function fetchItemPrice($item_id, $uom, $company = DEFAULT_COMPNAY_ID)
	{
		if ($item_id == null || $uom == null) {
			return null;
		}
		$db = $this->getAdapter();
		$select = $db->select()
		->distinct()
		->from('P21_Items_x_uom', ['price'])
		->where('location_id =?', $company)
		->where('item_id = ?', $item_id)
		->where('unit_of_measure = ?', $uom);
		$result = $db->fetchRow($select);
		return $result;
	}
}
