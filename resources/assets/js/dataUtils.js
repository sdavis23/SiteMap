import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {rgbToHex} from "./generalUtils.js";

/*
  creates a widget for use in legends.
    id - the databse id of the entity the widget refers to
    name - the name to display beside the widget.
    img_path - the path to the image indicating what it is:
      relative to the public folder.

      returns - a rect component
*/
export function legendWidget(id, name, img_path)
{


  return  <div key = {id} >
                                    {name}
                                  

                                  <div style = {{right: 30, top: 5, position: 'absolute'}} >
                                   <img key = {"Img" + id} src= {img_path} alt="icon" height="25" width="25" /> 
                                  </div>
                                </div>;

}

/*
  creates a widget for use in legends, with only the name, no icon.
    id - the databse id of the entity the widget refers to
    name - the name to display beside the widget.
    img_path - the path to the image indicating what it is:
      relative to the public folder.

      returns - a rect component
*/
export function legendNameWidget(id, name)
{


  return  <div key = {id} >
                                    {name}
                                  
                                </div>;

}


/*


  This modules holds all of the functions that are used for, 
    building specific lookups gor this application


  and transforming the data so that it can be displayed in a react component nicely
*/


export function fieldNameToColour(name)
{

  var color;

  switch(name)
  {

    case "Cadotte":
        color = [0, 0, 255];
        break;

    case "Harmon Valley South":
        color = [255, 0, 0];
        break;

    case "Harmon Valley Main":
       color = [0, 255, 0];
       break;


  }

  return color;

}

/*
  Displays a legend where the widget corresponds to a particular colour.
  id - the id of the entity correspodning to the widget
  name - the dispaly name of the widget
  colour - a three elment array of the form [R, G, B], represented form 0 to 255.

*/

export function legendColourWidget(id, name, colour)
{

   return  <div key = {id} >
                {name}
                                  

                  <div style = {{right: 35, top: 10, width: 15, height: 15, position: 'absolute', backgroundColor: rgbToHex(colour[0], colour[1], colour[2])}} >
                     
                  </div>
              </div>;

}


export function fieldNameToTreeWidget(fieldName)
{


  return {id: fieldName.id, widget: legendColourWidget(fieldName.id, fieldName.name, fieldNameToColour(fieldName.name)) };

}

export function fieldTypeToTreeWidget(fieldType)
{

  

  return {id: fieldType.id, widget: legendWidget(fieldType.id, fieldType.name, fieldTypeNameToIconPath(fieldType.name)) };

}

export function accountToTreeWidget(account)
{

  return {id: account.id, widget: legendNameWidget(account.id, account.name)};
}

export function fieldTypeNameToIconPath(fieldTypeName)
{




  var img_path;

    switch(fieldTypeName)
    {


      case "Plant":
        img_path = "/plant_icon.jpg";
        break;

      case "Compressor":
        img_path = "/compressor_icon.jpg";
         break;

      case "Unknown":
        img_path = "/unknown_icon.jpg";
         break;

      case "Satellite":
        img_path = "/satellite_icon.jpg";
         break;

      case "Facility":
        img_path = "/facility_icon.jpg";
         break;

      case "Pad":
        img_path = "/pad_icon.jpg";
         break;

      case "Battery":
        img_path = "/battery_icon.jpg";
         break;


  }

  //console.log("FieldType Name: " + fieldTypeName);
 // console.log("Image Path: " + img_path);

  return img_path;


}