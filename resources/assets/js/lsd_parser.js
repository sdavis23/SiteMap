import {CLIENT_INDEX , LE_INDEX, LSD_INDEX, SEC_INDEX, TWP_INDEX, RNG_INDEX, MER_INDEX, MER_CHAR } from './global.js';


// array of booleans that tell us whether or not we should take the value at element i.
// where i corresponds to the indices defined above
var do_take = [];


// global variable to keep track of where each worker is in terms of bytes
var worker_byte_table = [];

function isInt(text)
{

	console.log("Parse Int: " + parseInt(text));

	return !Number.isNaN(parseInt(text));

}


/*
	Takes in a string of the form RNGWMER and returns {range: RNG, mer: MER}
	for example:
	15W5M returns 
	{range: 15, mer: 5}

	if meridian is not there so 15 is rngMer then mer will be null

*/
export function parseRangeMeridian(rngMer)
{
	var rng = null;
	var meridian = null;


	var split_rng_mer = rngMer.split(MER_CHAR);
		
	rng = split_rng_mer[0];

	if(split_rng_mer.length > 1)
	{
		meridian =  parseInt(split_rng_mer[1]);
		
		if(meridian === NaN)
		{
			meridian = null
		}
				
	}


	return {range: rng, mer: meridian};
}


/*
	Parses an LSD:
		Takes a string of the form 
		CLIENT-LE-LSD-SEC-TWP-RNGWMER.

	
	These rules should be true: across all of OnSite's applications.

	Returns a structure of the form [client, le, lsd, sec, twp, rng, mer}

*/
export function parseLSD(folderName)
{

	var lsd_structure = {client: null, le: null, lsd: null, sec: null, twp: null, rng: null, mer: null};

	if(folderName.trim().length > 0)
	{


		console.log("PARSING: " + folderName);

		var folder_array = folderName.trim().split("-");
		var i;

		
		

		// the indices in this array should match up the LE_INDEX, CLIENT_INDEX etc. defined in global.js
		var lsd_array = [null, null, null, null, null, null, null];
		var lsd_index = 0;

		console.log("Folder Array 0: " + folder_array[0]);

		lsd_array[0] = folder_array[0] == '?' ? null : folder_array[0];
		lsd_index = 1;

		var i;
		
		// put the rest of the fields in their place, excpet for the last which needs to be check for 15W5
		// assumes they are parsable ints
		for(i = 1; (i < folder_array.length && lsd_index < RNG_INDEX); i++)
		{

			console.log("Folder Array " + i + ", " + JSON.stringify(folder_array[i]));
			var current_element = folder_array[i];

			if(current_element == '?')
			{

				lsd_array[lsd_index] = null;

			}

			else
			{

				

				if(isInt(current_element))
				{
					lsd_array[lsd_index] = parseInt(current_element);
				}
				else
				{
					lsd_array[lsd_index] = null;
				}
				
			}
			


			lsd_index++;
			console.log("LSD Index: " + lsd_index);
		}



		if(lsd_index == RNG_INDEX && folder_array[RNG_INDEX].length > 0)
		{

			var rng_mer = parseRangeMeridian(folder_array[RNG_INDEX]);

			lsd_array[RNG_INDEX] = rng_mer.range == '?' ? null : rng_mer.range;
			lsd_array[MER_INDEX] = rng_mer.mer == '?' ? null : rng_mer.mer;

			
		}


		lsd_structure.client = lsd_array[CLIENT_INDEX];
		lsd_structure.le = lsd_array[LE_INDEX];
		lsd_structure.lsd = lsd_array[LSD_INDEX];
		lsd_structure.sec = lsd_array[SEC_INDEX];
		lsd_structure.twp = lsd_array[TWP_INDEX];
		lsd_structure.rng = lsd_array[RNG_INDEX];
		lsd_structure.mer = lsd_array[MER_INDEX];

 	}
	

	return lsd_structure;
}






function parseNumberVal(n)
{
	return parseInt(n) || null;
}

function getRangeMeridian(val)
{

	var val_array = val.split(MER_CHAR);
	if(val_array.length > 1)
	{
			$("#mer_c").val(val_array[1]);
	}
						
	return val_array[0]; 

}








