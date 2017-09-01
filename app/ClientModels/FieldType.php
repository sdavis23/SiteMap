<?php

namespace App\ClientModels;




class FieldType implements \JsonSerializable
{
	private $id;
	private $name;
	
	
	public function __construct($db_id, $field_name)
	{

		$this->id = $db_id;
		$this->name = $field_name;

	}


	 public function jsonSerialize() 
	 {
        return [
            'id' => $this->id,
            'name' => $this->name
        ];
    }

}
