<?php


namespace App\SuiteComponents;
use App\SuiteComponents\MainSuiteClient;
use Illuminate\Contracts\Auth\Authenticatable; 
use App\SuiteComponents\SuiteEsriModelController;


class Employee implements \JsonSerializable, Authenticatable
{

	public $first_name;
	public $last_name;
	public $initials;
	public $id;
	public $occupation_ids;
	public $email;
	public $is_admin;

	private $remember_token_c;
	private $gprofile_token;

	public function __construct($id, $firstName, $lastName, $id_token, $is_admin, $email, $occupation_ids, $initials)
	{

		$this->id = $id;
		$this->first_name = $firstName;
		$this->last_name = $lastName;
		$this->occupation_ids = $occupation_ids;
		$this->initials = $initials;
		$this->gprofile_token = $id_token;
		$this->email = $email;
		$this->is_admin = $is_admin;

	}


	 public function jsonSerialize() 
	 {
        return [
        	'id' => $this->id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'occ_list' => $this->occupation_ids,
            'email' => $this->email,
            'initials' => $this->initials
        ];
    }


    public function getAuthIdentifierName()
    {
    	return 'id';
    }

    public function getAuthIdentifier()
    {
    	return $this->id;
    }

    public function getAuthPassword()
    {

    	return $this->gprofile_token;
    }

    public function getRememberToken()
    {

    	return $this->gprofile_token;

    }

    public function setRememberToken($value)
    {

    	$suite = new EmployeeSuite();
    	$suite->saveRememberToken($value, $this->id);


    }

    public function getRememberTokenName()
    {

    	return "remember_token_c";
    }


}

class EmployeeSuite extends SuiteEsriModelController
{

	protected function moduleName()
	{
		return 'ttick_Employee';
	}

	protected function sugarToModelId($sugar_obj)
	{
		return $sugar_obj->id->value;
	}

	

	protected function sugarObjectToModelObject( $sugar_pointcloud)
	{

		
		$employee = $this->getPrimaryValue($sugar_pointcloud);
		$occ_ids = array_map([$this, "sugarToModelId"], $this->getAllLinkedValues($sugar_pointcloud, 0));
		
		return new Employee($employee->id->value,
							$employee->first_name->value, 
							$employee->last_name->value, 
							$employee->remember_token_c->value,
							$employee->is_admin_c->value,
							$employee->email1->value,
							$occ_ids,
							$employee->initials->value);

	}

	public function getByEmailAddress($email_address)
	{
		$complete_list = $this->getModelObjects("ttick_employee_cstm.email_c = '" . $email_address . "'" , "", 1);
		
		if(count($complete_list) > 0)
		{
			return $complete_list[0];
		}
		else
		{
			return null;
		}

	}

	public function saveRememberToken($token, $id)
	{

		$record_vals = array(	
								"remember_token_c" => $token );

		


		$result = $this->client->saveExistingRecord($this->moduleName(), $id, $record_vals);
		

		

	}

	protected function getFields()
	{
		return array( 'id', 'first_name', 'last_name', 'initials', 'email1', 'remember_token_c', 'gprofile_token', 'is_admin_c');
	}


	/*

		Returns a json encoded list of the employees

		ORDER: the first record is the supervisor all others are ordered alphabetically

	*/
	public function get_employee_list()
	{

		return $this->getModelObjects( "", "", 70);
	}


	protected function getLinkedFields()
	{

		return array( array('name' => 'ttick_employee_ttick_occupations',
							'value' => array('id')
						)
					);

	}


}
