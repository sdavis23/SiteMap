import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {fieldNameToTreeWidget, fieldTypeToTreeWiget} from "./dataUtils.js";
import {FIELDNAME_GROUP,  FIELDTYPE_GROUP, CLIENT_GROUP,  ID_SEPERATOR, maxDepth, can_edit, isVirtualized} from "./global.js";
import Dock from "react-dock";
import SortableTree from 'react-sortable-tree';
import Portal from 'react-portal';

export default class FilterTree extends Component
{



  constructor(props)
  {
        super(props);

       // console.log("Building Map Filter Tree");

        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.handleMouseClick = this.handleMouseClick.bind(this);
        this.parseChildID = this.parseChildID.bind(this);
        this.handleTextLeave = this.handleTextLeave.bind(this);
        this.handleMinimizeClick = this.handleMinimizeClick.bind(this);

        var tree = []

        for(var key in this.props.categories)
        {
          var category = this.props.categories[key];

          //console.log("Creating a key: " + key);

          tree.push({

            expanded: true,
                title: category.title,
                children: this.fieldDataToChildrenStructure(category.data.map(function(data){ return category.dataToWidget(data); }), category.id)

          });
        }


       

        this.state = { treeData: tree };

       /* this.state = {
            treeData: 
              [{ expanded: true, 
                title: 'Field Name', 
                children: this.fieldDataToChildrenStructure(this.props.fieldNames.map(function(fieldName){ return fieldNameToTreeWidget(fieldName) } ), FIELDNAME_GROUP)
              },

              { expanded: true,
                title: 'Field Type',
                children: this.fieldDataToChildrenStructure(this.props.fieldTypes.map(function(fieldType){ return fieldTypeToTreeWiget(fieldType) }), FIELDTYPE_GROUP)
              } ],
        }; */



  }



  parseChildID(id)
  {

    //console.log("ID: " + id);

    var id_parts = id.split(ID_SEPERATOR);


    var f;
    var group_index = id_parts[0];
    var group_id = id_parts[1];
    var category = this.props.categories[group_index];

    f = function(site){ return category.partID(site) == group_id; }

    

    return {field_pred: f, group_type: group_index, id: group_id};
  }

  handleMouseEnter(e)
  {

    if(this.props.mouseHover != undefined)
    {
      var parsed_id  = this.parseChildID(e.target.id);
  
      this.props.mouseHover(parsed_id.field_pred);
    }

  }

  handleMouseLeave(e)
  {

    if(this.props.mouseLeftComponent != undefined)
    {
      this.props.mouseLeftComponent(e);
    }

  }

  handleMouseClick(e)
  {

    if(e.target.id.length != 0)
    {


       var parsed_id = this.parseChildID(e.target.id);

        var is_on;

        if(e.target.style.backgroundColor == 'grey')
        {
           is_on  = false;
          e.target.style.backgroundColor = 'white';
        }
        else
        {
          is_on = true;
          e.target.style.backgroundColor = 'grey';
        }
   
        //console.log("Field Pred: " + parsed_id.field_pred);    

      this.props.mouseClick(parsed_id.field_pred,  parsed_id.group_type, is_on);

    }
    

   
  }


    /*

      Takes in the data of the fields in form of 
        {id: widget }

      and returns the correctly associated set of children

    */
  fieldDataToChildrenStructure(field_data, group_type)
  {

    return field_data.map((field_entry) =>
        { return { title: <div  style = {{width: 250, height: 35 }} id = {group_type + ID_SEPERATOR + field_entry.id } onMouseEnter = {this.handleMouseEnter} onClick = {this.handleMouseClick}  > 
                                 
                                 {field_entry.widget}

                              </div> }; } );



  }

 

  handleTextLeave(e)
  {

    this.props.searchTextUpdate(e.target.value);

  }

  handleMinimizeClick(e)
  {
    console.log("Minimize Click Handled");
    this.props.onMinimize();
  }

  render() 
  {


      if(this.props.isVisible)
      {

        return (
          


            <Dock fluid={true}  dimMode = "none" isVisible={this.props.isVisible} zIndex={50} >
                
               

                  <div key= "min_min" style = {{right: 5, position: 'absolute'}}>
                    <img onClick = {this.handleMinimizeClick} key = {"Img"} src= "/diminish.png" alt="icon" height="16" width="16" /> 
                  </div>

                  <div key= 'text_box' style = {{left: 10, top: 5, position: 'absolute'}}>
                    <input  type = "text" onBlur = {this.handleTextLeave} />
                  </div>

                 
                    <SortableTree
                      treeData={this.state.treeData}
                      onChange={treeData => this.setState({ treeData })}
                      maxDepth = {maxDepth}
                      key = "filter_tree"
                      style = {{top: 35, height: '100%'}}
                      isVirtualized = {isVirtualized}
                      canDrag={({ node }) => can_edit}
                      canDrop={({ nextParent }) => can_edit} />
                 

              </Dock>
             
          
        );

      }

      else
      {

        return(


          <Portal isOpened = {true} >
            <div key ="expand_button" style = {{position: 'absolute', width: '100%', left: 25 , top: 85, zIndex: 50}}>

              <button onClick = {this.handleMinimizeClick} > Expand Filter </button>

            </div>
          </Portal >

          );


      }
      
  }
}