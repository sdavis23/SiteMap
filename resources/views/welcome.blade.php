<!doctype html>
<html lang="{{ config('app.locale') }}">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Laravel</title>

        <!-- Fonts -->
         
       
        <link href="https://fonts.googleapis.com/css?family=Raleway:100,600" rel="stylesheet" type="text/css">

        <script src="/js/app.js"></script> 
        <script src="https://apis.google.com/js/platform.js" async defer></script>
        <meta name="google-signin-client_id" content="433437658657-n1ejhd4mjd14agi06j57vbj3fl0nrbnk.apps.googleusercontent.com">

        <script type="text/javascript">

             $(document).ready(function()
                    {
                         
                         $("#SignIn").center();
                         $("#Logo").centerLeft();
                      });
           

            function onSignIn(googleUser) 
            {
                console.log("HELLO");
                var profile = googleUser.getBasicProfile();
                    
                console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
                console.log('Name: ' + profile.getName());
                console.log('Image URL: ' + profile.getImageUrl());
                console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.  
                console.log("Login ID Token: " + JSON.stringify(googleUser.getAuthResponse().id_token));

                    $.ajax({
                        type: "POST",
                        url: "/login",
                        data: {  _token: "{{ csrf_token() }}", id_token: googleUser.getAuthResponse().id_token , email: profile.getEmail() },
                      
                        complete: function(e)
                        {
                            console.log(JSON.stringify(e));

                            var response_data = JSON.parse(e.responseText).LoggedIn

                            if(e.responseJSON.LoggedIn)
                            {

                                window.location.href = "/map_view";
                            }
                              
                            

                        }
                        
                    });





            }
           

        </script>


    <style>

        #short_text{

            width: 85px;
        }

        input[type=number]{
            width: 85px;
        } 
    </style>

   
    </head>
    <body>
       
         <div class="g-signin2" id = "SignIn" data-onsuccess="onSignIn"></div>
         <img  id = "Logo" src="/images/CompanyLogo.PNG" alt="ONSITELOGO" style="width:344px;height:62px;top:75px">
         <div id = "example" style="position: absolute; width: 100%;"></div>
           
    </body>
</html>
