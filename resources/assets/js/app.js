

import * as Rx from "rxjs"
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PointCloudNavigator from  "./PointCloudNavigator.js";
import {enterKeys} from "./generalUtils.js";
import {fieldNameToColour} from "./dataUtils.js";


/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');


window.Vue = require('vue');





jQuery.fn.center = function () 
{

    this.css("position","absolute");
    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + 
                                                $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + 
                                                $(window).scrollLeft()) + "px");
    return this;
}


jQuery.fn.centerLeft = function () {
    this.css("position","absolute");
  
    
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + 
                                                $(window).scrollLeft()) + "px");
    return this;
}





function ajax_get(url)
{

 //console.log("********** URL: " + url)

return new Promise( (resolve, reject) => {
  $.get(url, 
    function(data, status)
    {

      //console.log("Resolving Promise: " + url + ": " + JSON.stringify(data));

      resolve( JSON.parse(data) );

    });

  });

}



function buildLookups(fieldNames, fieldTypes, well_data)
{

 // console.log("Building Lookups: ");

  return {

    filter_lookups: buildFilterLookups(fieldNames, fieldTypes, well_data),
    fieldname_color_lookups: fieldNameColourLookUp(fieldNames),
    fieldtype_color_lookups: fieldTypeColourLookUp(fieldTypes),
    fieldname_name_lookups: fieldNameNameLookUp(fieldTypes)

  };


}

function fieldNameNameLookUp(fieldTypes)
{

  return enterKeys(fieldTypes, function(key){ return key.id; }, function(key){ return key.name; });

}


function fieldTypeColourLookUp(fieldTypes)
{

  return enterKeys(fieldTypes, function(key){ return key.id; }, function(key){ return fieldNameToColour(key.name); });

}


function fieldNameColourLookUp(fieldNames)
{

  return enterKeys(fieldNames, function(key){ return key.id; }, function(key){ return fieldNameToColour(key.name); });

}





function buildEmptyLookup(keys)
{

  return enterKeys(keys,  function(key){return key.id; }, function(key){ return new Array(); } );
}

/*
  Takes in an array of well_data structures and turns them into lookup-tables based on the 
  field_id's and field name id's
*/
function buildFilterLookups(fieldnames, fieldtypes, well_data)
{

  //console.log("Building Filter Lookups");


  var fieldname_table = buildEmptyLookup(fieldnames);
  var fieldtype_table = buildEmptyLookup(fieldtypes);



  var i;
  for(i = 0; i < well_data.length; i++)
  {
    
    
    
    fieldname_table[well_data[i].field_id].push(well_data[i]);
    fieldtype_table[well_data[i].field_type].push(well_data[i]);
  }


  return {
    by_fieldname: fieldname_table,
    by_fieldtype: fieldtype_table

  };

}

function grabId(id_el)
{
  return id_el.id;
}


/*function createMap()
{
  esriLoader.dojoRequire(['esri/geometry/WebMercatorUtils'], (Point) => {
    // create map with the given options at a DOM node w/ id 'mapNode' 
    console.log("Utils: " + JSON.stringify(new Point(50, 50)));
  });

} */
 
$(window).bind("load", function()
{


  


var prereq_data = [ajax_get("/mapdata"), ajax_get("/filterdata"), ajax_get('/account_index')];

	Promise.all(prereq_data).then(function(data)
	{

    var map_points = data[0];
		var field_data = data[1];
    var accounts = data[2];

		var lookups = buildLookups(field_data.FieldName, field_data.FieldType, map_points);


  
  ReactDOM.render(<PointCloudNavigator   fieldNames =  {field_data.FieldName }
                                         fieldTypes = {field_data.FieldType}
                                         accounts = {accounts}
                                         account_lookup = {enterKeys(accounts, function(acct){ return acct.id; }, function(acct){ return acct; })}
                                         well_sites = {map_points}
                                         empty_fieldname_lookup = {buildEmptyLookup(field_data.FieldName)}
                                         empty_fieldtype_lookup = {buildEmptyLookup(field_data.FieldType)}
                                         fieldNameColourLookUp = {lookups.fieldname_color_lookups}
                                         fieldTypeColourLookUp = {lookups.fieldtype_color_lookups}
                                         fieldNameLookUp = {lookups.fieldname_name_lookups} />,

                    document.getElementById("console")); 


 

		
	});
	


	
});
  
