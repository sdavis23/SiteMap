import React, { Component } from 'react';
import ReactDOM from 'react-dom';


export function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}


// allows us to go from an r g b colour to a hexadecimal colour
export function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}


/*

  Generates a lookup-table using key_data.

  Specificaly the keys are generate by calling key_f on key_data
    and by claling value_f on key_data

*/
export function enterKeys(key_data, key_f, value_f)
{

  var ret_dict = {};

  key_data.forEach(function(key)
  {
    //console.log("Creating Key: " + value_f(key) );
    ret_dict[key_f(key)] = value_f(key);

  });

  //console.log("Ret Dict: " + JSON.stringify(ret_dict))

  return ret_dict;


}


/*

  Takes in two sets, each of the form,
    { visible, hidden}

    and returns

    {visible, hidden}

    where visible is the union of the two visible sets, and hidden
    is the complement of the union of the two visible sets.

    both visible and hidden are arrays with the uwi's fo the site. 

    Assumes the union of visible and hidden in both setA and setB 
      equals the complete set we're after.

*/
export function unionVisible(setA, setB)
{

 // console.log("******* UNION VISIBLE **********");

 var set1 = setB.visible.reduce(

    function(current_union, site)
    {

     // console.log("1 site organized");

      if(setA.visible.includes(site))
      {
        current_union.visible.push(site);
      }

      else
      {
        current_union.hidden.push(site);
      }

      return current_union;

    }, {visible: [], hidden: []});


 //console.log("Set A: " + JSON.stringify(setA));
 //console.log("Set B: " + JSON.stringify(setB));

 //console.log("Set 1: "  + JSON.stringify(set1));

 return {visible: set1.visible, hidden: set1.hidden.concat(setB.hidden)};
}


