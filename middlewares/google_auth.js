/**
 * Created by Praveen Gupta on 30-07-2017.
 */
var GoogleAuth = require('google-auth-library');
var auth = new GoogleAuth;
/*var CLIENT_ID="1092909644467-gegh4tedbru8abno15kkhr6u4ea8tfco.apps.googleusercontent.com";

var client = new auth.OAuth2(CLIENT_ID, '', '');
client.verifyIdToken(
    token,
    CLIENT_ID,
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3],
    function(e, login) {
        var payload = login.getPayload();
        var userid = payload['sub'];
        // If request specified a G Suite domain:
        //var domain = payload['hd'];
    });*/
module.exports=auth;