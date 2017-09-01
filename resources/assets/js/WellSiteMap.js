import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {fieldTypeNameToIconPath} from "./dataUtils.js"
import Dock from 'react-dock';
import { Map, Scene, Graphic, Symbols, Geometry, Layers, Popup} from 'react-arcgis';


export default class WellSiteMap extends Component
{
  constructor(props)
  {
    super(props);

   /* console.log("Well Site Map");
    console.log("Name Colour Lookup: " +   JSON.stringify(this.props.fieldNameColourLookUp));
    console.log("Type Colour Lookup: "  +  JSON.stringify(this.props.fieldTypeColourLookUp)); */

    this.state = {  map_view: null,
                    popups: [],
                    map_points: this.props.well_sites,
                    fieldNameColour: this.props.fieldNameColourLookUp,

                    fieldTypeColour: this.props.fieldTypeColourLookUp };

    this.handleMapClick = this.handleMapClick.bind(this);

    this.siteToGraphic = this.siteToGraphic.bind(this);

   

  }

  siteToGraphic(site)
  {
    
    //console.log("SITE TO GRAPHIC: " + JSON.stringify(site));


    return (
      <Graphic key = {site.uwi} >
            

        <Symbols.PictureMarkerSymbol

                symbolProperties={{
                   
                   url: fieldTypeNameToIconPath(this.props.fieldNameLookUp[site.field_type]),
                   size: "10px",
                   outline: {  // autocasts as esri/symbols/SimpleLineSymbol
                color: [ 255, 255, 0 ],
                width: 3  // points
              }
                  }} />


           

              
              
          <Geometry.Point
              geometryProperties={{
                  latitude: site.lat,
                  longitude: site.long
              }} />
        </Graphic>
      );

  }

  siteToColouredGraphic(site)
  {
    
  

    return (
      <Graphic key = {site.uwi} >
            

       <Symbols.SimpleMarkerSymbol
                symbolProperties={{
                  style: "square",
            color: this.state.fieldNameColour[site.field_id],
            size: "25px",  // pixels
            
              }} />

           

              
              
          <Geometry.Point
              geometryProperties={{
                  latitude: site.lat,
                  longitude: site.long
              }} />
        </Graphic>
      );

  }

  componentWillReceiveProps(props)
  {
    this.setState({ map_view: this.state.map_view,
                    popups: this.state.popups,
                    map_points: props.well_sites,
                    fieldNameColour: props.fieldNameColourLookUp,
                    fieldTypeColour: props.fieldTypeColourLookUp });
  }

    handleMapClick(e)
    {
      
      console.log("Map Clicked!");
     this.props.onMapClick(e.mapPoint);
    }

    /*

    Takes an object of the form, {title, display, lat, long} 
    and converts into into a react component for popups on arcgis.
  */
   popupSpecToPopUpDisplay(spec)
   {

      return <Popup
            key = {9}
            popupProperties={{
                content: spec.display,
                location: [spec.long, spec.lat],
                title: spec.title
            }} />;

   }


  render()
  {
  
  
    //console.log("Number of Map Points: " + this.state.map_points.length);
  
    var points = this.state.map_points.map((site) => { return this.siteToGraphic(site); });


    var colour_points =  this.state.map_points.map((site) => { return this.siteToColouredGraphic(site); });

    var center_long;
    var center_lat;

    if(this.state.map_points.length > 0)
    {

      center_long = this.state.map_points[0].long;
      center_lat = this.state.map_points[0].lat;

    }
    else
    {

      center_long = 100;
      center_lat = 100;

    }

   

    var children = [ <Layers.GraphicsLayer key = "Graphics1" >
           {colour_points}
        </Layers.GraphicsLayer>,  

        <Layers.GraphicsLayer key = "Graphics2">
            {points }
          </Layers.GraphicsLayer >];


  console.log("****POPUP: **** " + JSON.stringify(this.props.popup));

    if(this.props.popup != null)
    {
      console.log("POPOPWAS NOT NULL");
      children.push(this.popupSpecToPopUpDisplay(this.props.popup));
    }

    JSON.stringify("*** CHILDREN count: " + children.length)

  
    return(
    <Map
        
        style={{ width: '100vw', height: '100vh' }}
        onClick = { this.handleMapClick }
        mapProperties={{ basemap: 'hybrid' }} 
        viewProperties={{
                center: [center_long, center_lat],
                zoom: 10,

            }} 
         
        >
          
      
        

       
        {children}
         
        </Map>);

  

  }

}