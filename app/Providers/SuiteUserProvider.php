<?php

namespace App\Providers;
use App\SuiteComponents\MainSuiteClient;
use App\SuiteComponents\EmployeeSuite;
use Google_Client; 


class SuiteUserProvider implements \Illuminate\Contracts\Auth\UserProvider
{


    // retrieves by the suite user id
    public function retrieveById($identifier)
    {
        $suite = new EmployeeSuite();
        //echo "HELLO FROM RETRIEVE";

        return $suite->getModelById($identifier);

    }


    public function retrieveByToken($identifier, $token)
    {

        $suite = new EmployeeSuite();
        return $suite->getModelById($identifier);

    }

    public function updateRememberToken(\Illuminate\Contracts\Auth\Authenticatable $user, $token)
    {

        $user->setRememberToken($token);

    }

    // accepts an email and a user id, substituting for a "password" on the system
    public function retrieveByCredentials(array $credentials)
    {
        $suite = new EmployeeSuite();

        //echo "HELLO FROM SUITE USER PROVIDER";



        return $suite->getByEmailAddress( $credentials['email']);


    }
    

    //Does the google credential validation and ensures they are the same
    public function validateCredentials(\Illuminate\Contracts\Auth\Authenticatable $user, array $credentials)
    {

        $CLIENT_ID = "433437658657-n1ejhd4mjd14agi06j57vbj3fl0nrbnk.apps.googleusercontent.com";

        $client = new Google_Client(['client_id' => $CLIENT_ID]);
        $id_token = $credentials['id_token'];

        $employee_suite = new EmployeeSuite();
        $email_list = $employee_suite->getModelObjects( "ttick_employee_cstm.email_c = '" . $credentials['email'] . "'" , "", 1);

        //echo "ID Token: " . $id_token;
        //echo "Verify: " . print_r($client->verifyIdToken($id_token), true);

        $payload = $client->verifyIdToken($id_token);

        if($payload && count($email_list) > 0)
        {
            return true;
        }
        else
        {
            return false;
        }

        
    }


} 
