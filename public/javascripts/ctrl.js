/**
 * Created by Praveen Gupta on 19-07-2017.
 */

app.controller('homeCtrl',
    ['$sessionStorage', '$http', '$scope', '$state', function ($sessionStorage, $http, $scope, $state) {
        $scope.openPlaylist = function (name) {
            $sessionStorage.currentPlaylistName = name;
            $state.go('playlist');
        };

        /*var url = '/api/playlists/public';
         if ($sessionStorage.user.loggedIn) {
         url = '/api/playlists/' + $sessionStorage.user.email + '/orPublic';
         }*/

        $http(
            {
                method: 'GET',
                url: '/api/playlists'
            }).then(function success(res) {
            console.log('Success mei ghusa');
            console.log(res);
            $scope.playlists = res.data;
        }, function fail(err) {
            console.log(err);
        });
        $scope.formatDate = function (d) {
            var date = d.split("-");
            return date[2].slice(0, 2) + " " + ["Jan", "Feb", "Mar", "Apr", "May", "June",
                    "July", "Aug", "Sep", "Oct", "Nov", "Dec"][parseInt(date[1])] + " " + date[0];
        };

    }]);

app.controller('loginCtrl',
    ['$scope', '$window', '$sessionStorage', '$state', function ($scope, $window, $sessionStorage, $state) {
        //$scope.hideLoginButton=$sessionStorage.user.loggedIn;
        /*if ($sessionStorage.user.loggedIn)
         $scope.user=$sessionStorage.user;*/
        if ($sessionStorage.user.loggedIn === true)
            $scope.user = $sessionStorage.user;
        else {
            $scope.user = {};
            $scope.user.loggedIn = false;
        }


        $scope.hideLoginButton = $scope.user.loggedIn;
        console.log($sessionStorage.user.loggedIn);
        $scope.$on('event:google-plus-signin-success', function (event, authResult) {
            // Send login to server or save into cookie
            //console.log(authResult.w3);
            $scope.user = $sessionStorage.user;
            $sessionStorage.user = {
                loggedIn: true,
                id: authResult.w3.Eea,
                name: authResult.w3.ig,
                imageUrl: authResult.w3.Paa,
                email: authResult.w3.U3
            };
            $scope.user = $sessionStorage.user;
            console.log($scope.user);
            $scope.hideLoginButton = $sessionStorage.user.loggedIn;

            $state.reload();
        });
        $scope.$on('event:google-plus-signin-failure', function (event, authResult) {
            // Auth failure or signout detected
            console.log("Could not LOGIN ....");
            console.log(authResult);

        });

        $scope.signOut = function () {
            var auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut().then(function () {
                console.log('User signed out.');
                $scope.hideLoginButton = false;
                $sessionStorage.user.loggedIn = false;
                $sessionStorage.user.id = undefined;
                $sessionStorage.user.name = undefined;
                delete $sessionStorage.user.imageUrl;
                $sessionStorage.user.email = undefined;
                $state.user = $sessionStorage.user;
                // console.log($scope.user.imageUrl);
                // $scope.hideLoginButton=$sessionStorage.user.loggedIn;
                $state.reload();
            });
        };
        $scope.signIn = function () {
            //console.log('yoooooooo' + $window.profile.getEmail());
            /* $sessionStorage.user = {
             loggedIn: true,
             id: $window.profile.getId(),
             name: $window.profile.getName(),
             imageUrl: $window.profile.getImageUrl(),
             email: $window.profile.getEmail()
             };*/
            // $sessionStorage.user = $window.user;
            //  console.log($sessionStorage.user);
            //$scope.user = $window.user;
            //$scope.hideLoginButton = true;
        };
    }]);
/*
 var profile, user;
 function onSignIn(googleUser) {

 profile = googleUser.getBasicProfile();
 /!* console.log('ID: ' + profile.getId());
 console.log('Name: ' + profile.getName());
 console.log('Image URL: ' + profile.getImageUrl());
 console.log('Email: ' + profile.getEmail());*!/
 user = {
 loggedIn: true,
 id: profile.getId(),
 name: profile.getName(),
 imageUrl: profile.getImageUrl(),
 email: profile.getEmail()
 };
 }*/
