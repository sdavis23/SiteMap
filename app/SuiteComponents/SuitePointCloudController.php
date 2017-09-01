<?php


namespace App\SuiteComponents;


use App\ClientModels\PointCloud;
use App\ClientModels\FieldName;
use App\ClientModels\FieldType;

use App\SuiteComponents\SuiteEsriModelController;



/*
	Class responsible for controlling the data between the SuiteModel
	and the internal
*/

class SuitePointCloudController extends SuiteEsriModelController
{

	protected function moduleName()
	{
		return 'pcld3_PointCloud3';
	}

	protected function sugarObjectToModelObject( $sugar_pointcloud)
	{
		
		
		$pointcloud = $this->getPrimaryValue($sugar_pointcloud);
		$fieldname_ids = $this->getFirstLinkedValue($sugar_pointcloud, 0);
		$fieldtype_ids = $this->getFirstLinkedValue($sugar_pointcloud, 1);
		$account = $this->getFirstLinkedValue($sugar_pointcloud, 2);

		return new PointCloud($pointcloud->folder_name_c->value, 
													$pointcloud->lat_c->value, 
													$pointcloud->longitude_c->value,
													$fieldname_ids->id->value,
													$fieldtype_ids->id->value,
													$account->id->value,
													$pointcloud->le_c->value,
													$pointcloud->lsd->value,
													$pointcloud->sec_c->value,
													$pointcloud->twp_c->value,
													$pointcloud->rng_c->value, $pointcloud->mer_c->value);

	}

	protected function getFields()
	{
		return array( 'id', 'lat_c', 'longitude_c', 'folder_name_c', 'le_c', 'lsd', 'sec_c', 'twp_c', 'rng_c', 'mer_c');
	}


	protected function getLinkedFields()
	{

		return array( array('name' => 'pcld3_fieldname_pcld3_pointcloud3_1pcld3_fieldname_ida',
							'value' => array('id')
						),

						array(	'name' => 'pcld3_fieldtype_pcld3_pointcloud3_1pcld3_fieldtype_ida',
								'value' => array('id')
						),

						array(	'name' => 'accounts_pcld3_pointcloud3_1',
								'value' => array('id')
						),
					);

	}

}

class SuiteFieldNameController extends SuiteEsriModelController
{


	protected function moduleName()
	{

		return "pcld3_FieldName";

	}

	protected function sugarObjectToModelObject($sugar_pointcloud)
	{
		$fieldName = $this->getPrimaryValue($sugar_pointcloud);

		return new FieldName($fieldName->id->value, $fieldName->name->value);
	}


	protected function getFields()
	{
		return array( 'id', 'name');
	}

}

class SuiteFieldTypeController extends SuiteEsriModelController
{


	protected function moduleName()
	{

		return "pcld3_FieldType";

	}

	protected function sugarObjectToModelObject($sugar_fieldName)
	{

		$fieldType = $this->getPrimaryValue($sugar_fieldName);

		return new FieldType($fieldType->id->value, $fieldType->name->value);
	}


	protected function getFields()
	{
		return array( 'id', 'name');
	}

}