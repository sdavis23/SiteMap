<?php


namespace App\SuiteComponents;

use App\SuiteComponents\SuiteEsriModelController;



class  Account implements \JsonSerializable
{
	

	public $name;
	public $id;
	public $short_name;
	

	public function __construct($id, $name, $short_name)
	{
		$this->id= $id;
		$this->name = $name;
		$this->short_name =$short_name;
		
	}


	 public function jsonSerialize() 
	 {
        return [
        	'id' => $this->id,
        	'name' => $this->name,
        	'short_name' => $this->short_name,
        ];
    }

}

class AccountSuite extends SuiteEsriModelController
{


	protected function moduleName()
	{
		return 'Accounts';
	}


	protected function sugarObjectToModelObject( $sugar_pointcloud)
	{

		
		$account = $this->getPrimaryValue($sugar_pointcloud);
		
		

		return new Account(	$account->id->value,
							$account->abbrev_c->value, 
							$account->name->value);

	}



	protected function getFields()
	{
		return array( 'id',  'abbrev_c', 'name');
	}


	


}