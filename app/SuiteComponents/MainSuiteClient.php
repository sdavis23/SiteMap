<?php


namespace App\SuiteComponents;
use DataConnection\SuiteCORE\SuiteClient;

class MainSuiteClient extends SuiteClient
{


	function __construct()
	{

		parent::__construct("http://clientcontrol.onsite3d.com/service/v4_1/rest.php", 'admin', 'DARCT-4532');

	}

}