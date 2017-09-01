<?php

namespace App\ClientModels;

class PointCloud implements \JsonSerializable
{
	private $uwi;
	private $lat;
	private $lng;
	private $fieldname_id;	
	private $fieldtype_id;
	private $le;
	private $lsd;
	private $sec;
	private $twp;
	private $rng;
	private $mer;
	private $accountID;
	
	public function __construct($id, $latitude, $longitude, $fieldNameID, $fieldtype, $account, $le, $lsd, $sec, $twp, $rng, $mer)
	{

		$this->uwi = $id;
		$this->lat = $latitude;
		$this->lng = $longitude;
		$this->fieldname_id = $fieldNameID;
		$this->fieldtype_id = $fieldtype;
		$this->accountID = $account;
		$this->le = $le;
		$this->lsd = $lsd;
		$this->sec = $sec;
		$this->twp = $twp;
		$this->rng = $rng;
		$this->mer = $mer;

	}


	 public function jsonSerialize() 
	 {
        return [
            'uwi' => $this->uwi,
            'lat' => $this->lat,
            'long' => $this->lng,
            'field_id' => $this->fieldname_id,
            'field_type' => $this->fieldtype_id,
            'account' => $this->accountID,
            'le' => $this->le,
            'lsd' => $this->lsd,
			'sec' => $this->sec,
			'twp' => $this->twp,
			'rng' => $this->rng,
			'mer' => $this->mer 
        ];
    }

}
