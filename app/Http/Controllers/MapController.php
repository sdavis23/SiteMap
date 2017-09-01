<?php

namespace App\Http\Controllers;




use Illuminate\Http\Request;
use App\ClientModels\PointCloud;
use App\SuiteComponents\SuiteClient;
use App\SuiteComponents\SuitePointCloudController;
use App\SuiteComponents\SuiteFieldNameController;
use App\SuiteComponents\SuiteFieldTypeController;
use App\SuiteComponents\AccountSuite;


class MapController extends Controller
{

	// the data necessary to connect to suitecrm's rest api
	private $url = "http://clientcontrol.onsite3d.com/service/v4_1/rest.php";
    private $username = "admin";
    private $password = "DARCT-4532";
    private $data_client;
    private $pointcloud_controller;
    private $fieldname_controller;

    public function __construct()
    {
    	
    	$this->pointcloud_controller = new SuitePointCloudController();
    	$this->fieldname_controller =  new SuiteFieldNameController();
    	$this->fieldtype_controller =  new SuiteFieldTypeController();
    	$this->account_controller = new AccountSuite();
    } 
   

	/*
		Returns: the map data from the SuiteCRM database 
			in JSON format
	
	*/
	function get_map_data()
	{


		return json_encode(
			$this->pointcloud_controller->getModelObjects( 
														"lat_c <> '0' AND longitude_c <> '0' ",
														 "jobnum_c",
														 '1000'));
	}

	/*

		Returns the data used to filter a map such as,
			types of wells 
			and fieldnames

	*/
	function get_filter_data()
	{


		return json_encode(
			array('FieldType' =>
					$this->fieldtype_controller->getModelObjects(
														"",
														 "",
														 '25'),

				   'FieldName' =>
					$this->fieldname_controller->getModelObjects(
														"",
														 "",
														 '25'),
				)
			);

	}


	function get_all_accounts()
	{
		return json_encode($this->account_controller->getModelObjects("", "", '25'));
	}


	function show()
  	{

				 
		return view('map');

	}


}
