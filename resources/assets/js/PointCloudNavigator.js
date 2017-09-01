import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {unionVisible, enterKeys} from "./generalUtils.js";
import update from 'react-addons-update';
import { Map, Scene, Graphic, Symbols, Geometry, Layers, Popup} from 'react-arcgis';
import WellSiteMap from "./WellSiteMap.js";
import MapFilterTree from "./MapFilterTree.js";
import {FIELDNAME_GROUP,  FIELDTYPE_GROUP, CLIENT_GROUP,  ID_SEPERATOR} from "./global.js";
import {fieldNameToTreeWidget, fieldTypeToTreeWidget, accountToTreeWidget} from "./dataUtils.js";
import {parseLSD} from "./lsd_parser.js";


 function wellSiteToTreeObject(well_site)
  {
    return {uwi: well_site.uwi, account: well_site.account, lat: well_site.lat, lng: well_site.long};
  }

  /*
    Given two values checks of both are equal or a is null

  */
  function equalOrNull(valA, valB)
  {
    return (valA == valB) || (valA == null);
  }


export default class PointCloudNavigator extends Component
{


  constructor(props)
  {
    super(props);


    this.calculateChanges = this.calculateChanges.bind(this);

  
    this.handleMouseClick = this.handleMouseClick.bind(this);

    this.reduceVisibilityArray = this.reduceVisibilityArray.bind(this);
    this.calculateVisAndHiddenArrays = this.calculateVisAndHiddenArrays.bind(this);
    this.updateLSDSearch = this.updateLSDSearch.bind(this);
    this.isSiteInSearch = this.isSiteInSearch.bind(this);
    this.minimizeTree = this.minimizeTree.bind(this);
    this.handleMapClick = this.handleMapClick.bind(this);
    this.buildKDTree = this.buildKDTree.bind(this);


    //console.log("Init Visible: " + JSON.stringify(this.props.well_sites.map((well_site) => well_site.uwi)))
    var well_ids = this.props.well_sites.map((well_site) => well_site.uwi);

    var init_categories = {};

    init_categories[FIELDTYPE_GROUP] = 
    {

      id: FIELDTYPE_GROUP,
      title: "Field Type",
      hidden: [],
      visible: well_ids,
      num_of_selections: 0,
      data: this.props.fieldTypes,
      dataToWidget: fieldTypeToTreeWidget,
      partID: function(site){ return site.field_type; }


    };

    init_categories[FIELDNAME_GROUP] = 
    {

      id: FIELDNAME_GROUP,
      title: "Field Name",
      hidden: [],
      visible: well_ids,
      num_of_selections: 0,
      data: this.props.fieldNames,
      dataToWidget: fieldNameToTreeWidget,
      partID: function(site){ return site.field_id; }

    };

    init_categories[CLIENT_GROUP] = 
    {

      id: CLIENT_GROUP,
      title: "Client",
      hidden: [],
      visible: well_ids,
      num_of_selections: 0,
      data: this.props.accounts,
      dataToWidget: accountToTreeWidget,
      partID: function(site){ return site.account; }

    };

   /* var init_visible = {};
    var num_of_filters = {};

    init_visible[FIELDNAME_GROUP] = well_ids;
    init_visible[FIELDTYPE_GROUP] = well_ids;

    var init_hidden = {};

    init_hidden[FIELDNAME_GROUP] = [];
    init_hidden[FIELDTYPE_GROUP] = [];
    

    num_of_filters[FIELDNAME_GROUP] = 0;
    num_of_filters[FIELDTYPE_GROUP] = 0;   */ 

  
   

    this.state = {  popup: null,
                    tree: this.buildKDTree(function(well_sites){ return well_sites.map(function(well_site){ return wellSiteToTreeObject(well_site); }); }),
                    
                    well_site_lookup: enterKeys(this.props.well_sites, function(key){ return key.uwi; }, function(key){ return key; }),
                    visible_total: well_ids,
                    filter_categories: init_categories,
                    lsdSearch: {visible: well_ids, hidden: []},
                    filter_visible: true

                  };

    

  }


  /*
    Constructs a kdTree 

    wellSitesToTreeNodes - takes in an array of well_sites (entire obejct),
      and returns an array of object of the form: {uwi, account: ACCOUNT_ID, lat, lng}

  */
  buildKDTree(wellSitesToTreeNodes)
  {

    return new kdTree(wellSitesToTreeNodes(this.props.well_sites), this.distance, ["lat", "lng"]);

  }

  minimizeTree()
  {

    

    var isFilterVisible = !this.state.filter_visible;

    this.setState({
        popup: this.state.popup,
        tree: this.state.tree,
        well_site_lookup: this.state.well_site_lookup,
        visible_total: this.state.visible_total,
        filter_categories: this.state.filter_categories,
        filter_visible: isFilterVisible
    })
  }

 distance(a, b) 
 {
        var lat1 = a.lat,
        lon1 = a.lng,
        lat2 = b.lat,
        lon2 = b.lng;

        var rad = Math.PI/180;
        var dLat = (lat2-lat1)*rad;
        var dLon = (lon2-lon1)*rad;
        var lat1 = lat1*rad;
        var lat2 = lat2*rad;
        var x = Math.sin(dLat/2);
        var y = Math.sin(dLon/2);
        var a = x*x + y*y * Math.cos(lat1) * Math.cos(lat2); 
        return Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }


  handleMapClick(mapPoint)
  {

    var nearest = this.state.tree.nearest({lat: mapPoint.latitude, lng: mapPoint.longitude}, 1, 0.0002);

    if(nearest.length > 0)
    {
      var point = nearest[0][0];


     

      this.setState({

        popup: {title: "UWI: " + point.uwi + ", Client: " + this.props.account_lookup[point.account].short_name, display: "Well Site", lat: point.lat, long: point.lng},
        tree: this.state.tree,
        visible_total: this.state.visible_total,
        well_site_lookup: this.state.well_site_lookup,
        filter_categories: this.state.filter_categories,
        lsdSearch: this.state.lsdSearch,
        filter_visible: this.state.filter_visible
        

      }); 

    }
    else
    {
      this.setState({

        popup: null,
        tree: this.state.tree,
        visible_total: this.state.visible_total,
        well_site_lookup: this.state.well_site_lookup,
        filter_categories: this.state.filter_categories,
        lsdSearch: this.state.lsdSearch,
        filter_visible: this.state.filter_visible
        
      }); 
    }

  }

  /*
    Reduces well_sites into a structure of the form:
      { visible: [], hidden: []}

    using the preducate visible_pred

  */
  reduceVisibilityArray(well_sites, visible_pred)
  {


    var well_lookup = this.state.well_site_lookup;

    return well_sites.reduce(
      function(groupings, site)
      {

          var new_groupings = groupings;

          if(visible_pred(well_lookup[site]))
          {
            groupings.members.push(site);
          }
          else
          {
            groupings.complement.push(site);
          }


          return groupings;

      }, {members: [], complement: []});

  }

  calculateVisibilityArrayChanges(filter_pred, visible, hidden)
  {

   // console.log("Visible Well Sites: " + JSON.stringify(this.state.visible_well_sites));
   // console.log("Hidden Well Sites: " + JSON.stringify(this.state.hidden_well_sites));

    return {

      visible_change: this.reduceVisibilityArray(visible, filter_pred),
      hidden_change:  this.reduceVisibilityArray(hidden, filter_pred)

    };



  }




  /*
    Given a predicate function, and whether or not it is on or off as well as a set of currently_visible and
    currently_hidden arrays, with the number of filters applied, returns the new visible and new hidden, with
    the predicate applied.

    pred_func - the predicate to apply to currently_visible and currently_hidden
    currently_visible - the sites (just the uwi's) that are currently visible.
    currently_hidden - the sites that are currently hidden (just a list of uwi's)
    filters_applied - the number of filters currently applied.

    Returns:

      visible_well_sites: the new set of visible sites
      hidden_welll_sites
      num_of_filters_applied

  */
  calculateVisAndHiddenArrays(pred_func, is_on, currently_visible,  currently_hidden, filters_applied)
  {




    var changes = this.calculateVisibilityArrayChanges(pred_func, currently_visible, currently_hidden);

   console.log("Changes: " + JSON.stringify(changes));

    if(is_on)
    {
      //console.log("Changes, Child is currently on");


      if(filters_applied == 0)
      {

        
        return {  visible_well_sites: changes.visible_change.members.concat(changes.hidden_change.members),
                  hidden_well_sites:  changes.hidden_change.complement.concat(changes.visible_change.complement),
                  num_of_filters_applied: 1 };


      }

      else
      {

      
          
         return       { visible_well_sites: currently_visible.concat(changes.hidden_change.members),
                        hidden_well_sites:  changes.hidden_change.complement,
                        num_of_filters_applied: filters_applied + 1 };
      }
    }

    else
    {

     // console.log("Changes, child is currently off");

      if(filters_applied > 1)
      {

        return { 
                        visible_well_sites: changes.visible_change.complement,
                        hidden_well_sites:  currently_hidden.concat(changes.visible_change.members),
                        num_of_filters_applied: filters_applied - 1 };

      }
      else
      {
        return { 
                      visible_well_sites: currently_visible.concat(currently_hidden),
                      hidden_well_sites:  [],
                      num_of_filters_applied: 0};
      }
    }



  }


  /*

    Given the predicate functon for filtering, 
      whether or not the predicate is on or off
      and the unique identifier of the group to which the 
      predicate function belongs

    Returns: visible_total: the total number of visible array
      and: changed_categories

  */
  calculateChanges(pred_func, is_on, changed_index)
  {

    var type_filters_applied;
    var group_filters_applied;
    var prechange_category = this.state.filter_categories[changed_index];
   

    var categories = {};

      var changed_category = 
          this.calculateVisAndHiddenArrays(pred_func, 
              is_on, 
          prechange_category.visible, 
          prechange_category.hidden, 
          prechange_category.num_of_selections);

      
        /*var visibility_set = unionVisible({visible: changed_category.visible_well_sites, hidden: changed_category.hidden_well_sites}, 
                                          {visible: this.state.filter_categories[unchanged_index].visible, hidden: this.state.filter_categories[unchanged_index].hidden}) ; */

      var visibility_set = unionVisible({visible: changed_category.visible_well_sites, hidden: changed_category.hidden_well_sites}, this.state.lsdSearch); 

      for(var key in this.state.filter_categories)
      {

          if(key != changed_index)
          {
            visibility_set = unionVisible(visibility_set, {visible: this.state.filter_categories[key].visible, hidden: this.state.filter_categories[key].hidden});
            categories[key] = this.state.filter_categories[key];
          }
           
      }



       categories[changed_index] = 
      {

        id: changed_index,
        title: prechange_category.title,
        hidden: changed_category.hidden_well_sites,
        visible: changed_category.visible_well_sites,
        num_of_selections: changed_category.num_of_filters_applied,
        data: prechange_category.data,
        partID: prechange_category.partID,
        dataToWidget: prechange_category.dataToWidget

    };

   

        
       return {visible_total: visibility_set.visible, changed_categories: categories};

      
  }

 

  /*
    Build a new kdTree from a list of sites
    that are visible
  */
  refactorTreeFromVisible(visible_sites)
  {

   

    return this.buildKDTree(function(well_sites){ return  well_sites.reduce(
                                                function(current_array, well_site)
                                                {

                                                  if(visible_sites.includes(well_site.uwi))
                                                  {
                                                    current_array.push(wellSiteToTreeObject(well_site));

                                                  }


                                                  return current_array;

                                                }, 
                                                []);
                                            });

  }

  handleMouseClick(pred_func, group_type, is_on)
  {

    var visibility_set;

    //console.log("GROUP TYPE: " + group_type);

    visibility_set = this.calculateChanges(pred_func, is_on, group_type);
        
  
    //console.log("Visibility Set: " + JSON.stringify(visibility_set));
 

    this.setState({

        popup: this.state.popup,
        tree: this.refactorTreeFromVisible(visibility_set.visible_total),
        visible_total: visibility_set.visible_total,
        well_site_lookup: this.state.well_site_lookup,
        filter_categories: visibility_set.changed_categories,
        lsdSearch: this.state.lsdSearch,
        filter_visible: this.state.filter_visible

    });


  }

  

  /*

    Takes in a site and a search struct:
      returns a boolean to detmine if the site belongs within the search struct.
  */
  isSiteInSearch(site, search_struct)
  {

  
    console.log("Search struct: " + JSON.stringify(search_struct));
    console.log("Site: " + JSON.stringify(site));

    var search_conditions = [search_struct.client, search_struct.le, search_struct.lsd, search_struct.sec, search_struct.twp, search_struct.rng, search_struct.mer];
    var site_values = [this.props.account_lookup[site.account].short_name, site.le, site.lsd, site.sec, site.twp, site.rng, site.mer];
      
    var index = 0;
    var all_true = true;

    while(all_true && index < search_conditions.length)
    {

      console.log(" Search Condition: " + search_conditions[index]);
      console.log(" Site Value: " + site_values[index]);

      all_true = equalOrNull(search_conditions[index], site_values[index]);
      index++;
    }

    console.log("Found False: " + all_true);

    return all_true;

  }  



  updateLSDSearch(val)
  {



    var text_value = val.trim();
    var searchVisible;

    if(text_value.length > 0)
    {
      var well_site_lookup = this.state.well_site_lookup;
      var siteInSearch = this.isSiteInSearch;

      // gather what we're supposed to be searching for
      var search_struct = parseLSD(text_value);
      searchVisible = this.state.visible_total.reduce(
        function(accum, site_uwi)
        {

          console.log("Site UWI: " + site_uwi);

          var site = well_site_lookup[site_uwi];

          if(siteInSearch(site, search_struct))
        
          {
            //console.log("Pushing a Site");
            accum.visible.push(site_uwi);
          }

          else
          {
            accum.hidden.push(site_uwi);
          }

          return accum;

        }, {visible: [], hidden: []});

      searchVisible = this.state.lsdSearch.hidden.reduce(function(accum, site_uwi)
        {

          console.log("Site UWI: " + site_uwi);

          var site = well_site_lookup[site_uwi];

          if(siteInSearch(site, search_struct))
        
          {
            //console.log("Pushing a Site");
            accum.visible.push(site_uwi);
          }

          else
          {
            accum.hidden.push(site_uwi);
          }

          return accum;

        }, searchVisible);
    }
    else
    {
      searchVisible = {visible: this.props.well_sites.map((well_site) => well_site.uwi), hidden: []};
    }

      //console.log("New Visible: " + JSON.stringify(new_visible));

      var visibility_set = searchVisible 

      for(var key in this.state.filter_categories)
      {

        visibility_set = unionVisible(visibility_set, {visible: this.state.filter_categories[key].visible, hidden: this.state.filter_categories[key].hidden});
           
      }

      this.setState({

          popup: this.state.popup,
          tree: this.refactorTreeFromVisible(visibility_set.visible),
          visible_total: visibility_set.visible,
          well_site_lookup: this.state.well_site_lookup,
          filter_categories: this.state.filter_categories,
          lsdSearch: searchVisible,
          filter_visible: this.state.filter_visible

      });
    
  }



  render()
  {



    

     const div1 = (
        <div key ="filter_tree"  style= {{position: 'absolute', left: '80%', height: '100%', width: '100%'}}> 
        <MapFilterTree  categories = {this.state.filter_categories}
                        onMinimize = {this.minimizeTree}
                        searchTextUpdate = {this.updateLSDSearch}
                        isVisible = {this.state.filter_visible}
                        mouseClick = {this.handleMouseClick} />
      </div>);

    var well_sites = this.state.well_site_lookup;

    var sites_to_display = this.state.visible_total.map(( visible_well_site ) => well_sites[visible_well_site] );
   // console.log("Well Sites: " + JSON.stringify(well_sites));

    var div2 = 
    ( 

         <div key = "filter_list" style= {{position: "absolute", width: "600px"}} >
           <WellSiteMap  well_sites = {sites_to_display}
                         onMapClick = {this.handleMapClick}
                         popup = {this.state.popup}
                         fieldNameColourLookUp = {this.props.fieldNameColourLookUp} 
                         fieldTypeColourLookUp = {this.props.fieldTypeColourLookUp}
                         fieldNameLookUp = {this.props.fieldNameLookUp} />

          </div> 

    );

   
    const divs = [div1, div2];

     return (

        <div >
        {divs}
        </div>

      ); 


  }



}

