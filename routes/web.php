<?php

use Illuminate\Http\Request;
/*

|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


Route::get('/login_page', array('as' => 'login', 
	function()
	{

		return view('welcome');
		
	}));


Route::post("/login", 
	function(Request $request)
	{
		$login_credentials = $request->all();

		//return print_r($login_credentials, true);
		//$emp = $suite->getByEmailAddress($login_credentials['email']);
		//$emp->setRememberToken("hello");
		//Auth::attempt(['email' => $login_credentials['email'], 'id_token' => $login_credentials['id_token']], 1);

		Auth::attempt(['email' => $login_credentials['email'], 'id_token' => $login_credentials['id_token']], 1);
		//Auth::logout();

		if(Auth::check())
		{
			return array("LoggedIn" => true, "IsAdmin" => Auth::user()->is_admin);
		}

		else
		{
			return array("LoggedIn" => Auth::check());
		} 


		
	});

Route::get('/', 'MapController@show')->middleware('auth');
Route::get('/map_view', 'MapController@show')->middleware('auth');
Route::get('/mapdata', 'MapController@get_map_data');
Route::get('/filterdata', 'MapController@get_filter_data');
Route::get('/account_index', 'MapController@get_all_accounts');
