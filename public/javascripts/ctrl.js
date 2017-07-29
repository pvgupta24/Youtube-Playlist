/**
 * Created by Praveen Gupta on 19-07-2017.
 */

/*

 app.controller('loginCtrl', function ($location, $scope, $http, $rootScope, $sessionStorage) {


 $scope.submit = function () {
 $http({
 method: 'POST',
 url: "https://ieeespwd.herokuapp.com/api/users/" + $scope.username,
 data: {"password": $scope.password}
 }).then(function success(response) {
 if (response.data['statusText'] === "Success") {
 $sessionStorage.loggedIn = true;
 $rootScope.hideLogout = !$sessionStorage.loggedIn;
 $rootScope.hideLogin = $sessionStorage.loggedIn;
 $rootScope.username = $scope.username;
 $location.path('/home');

 $rootScope.toast = "Welcome " + $scope.username;
 toast();
 }
 else {
 $rootScope.toast = response.data['statusText'];
 toast();
 $sessionStorage.loggedIn = false;
 }
 }, function () {
 $rootScope.toast = "Could not complete your request.. Please try again.";
 toast();
 })
 };

 });

 app.controller('registerCtrl', function ($scope, $http, $location) {

 $scope.register = function () {
 var data = {
 "username": $scope.username,
 "password": $scope.password,
 "name": $scope.name,
 "admin": false,
 "email": $scope.email
 };
 $http({
 method: 'POST',
 url: "https://ieeespwd.herokuapp.com/api/users",
 data: data
 }).then(function success(response) {
 $location.path('/home');
 $rootScope.toast = 'Successfull added' + $scope.username;
 toast();
 });
 }

 });

 app.controller('usersCtrl', function ($scope, $http, $rootScope, $state, $location, $sessionStorage) {
 if (!$sessionStorage.loggedIn) {
 $rootScope.toast = "Please login to see users!!";
 toast();
 $state.go('login');
 }
 $scope.userDetail = {};

 $scope.userHide = true;

 $http({
 method: 'GET',
 url: "https://ieeespwd.herokuapp.com/api/users"
 }).then(function (response) {
 $scope.users = response.data.data;
 });
 $scope.userDetails = function userDetails(username) {
 $scope.username = username;
 $http({
 method: 'GET',
 url: "https://ieeespwd.herokuapp.com/api/users/" + username
 }).then(function (response) {
 $scope.userData = response.data;
 if ($scope.userData.admin) {
 $scope.userData.admin = "Admin";
 }
 else {
 $scope.userData.admin = "Basic User";
 }
 });
 $scope.userHide = false;

 };
 if ($rootScope.author != null)
 $scope.userDetails($rootScope.author.username);

 $rootScope.author = null;
 $scope.close = function () {
 $scope.userDetail = {};
 $scope.userHide = true;
 }
 });
 app.controller('logoutCtrl', function ($http, $scope, $state, $rootScope, $sessionStorage) {


 if ($sessionStorage.loggedIn == null)
 $sessionStorage.loggedIn = false;

 if ($sessionStorage.loggedIn !== null) {

 }
 $rootScope.hideLogout = !$sessionStorage.loggedIn;
 $rootScope.hideLogin = $sessionStorage.loggedIn;
 $scope.logOut = function () {
 toast();
 $http({
 method: 'POST',
 url: "https://ieeespwd.herokuapp.com/api/logout"
 }).then(function () {

 $sessionStorage.loggedIn = false;
 $rootScope.hideLogout = true;
 $rootScope.hideLogin = false;
 $state.go('home');
 $rootScope.toast = "Logged Out";
 toast();
 }

 , function () {
 $rootScope.toast = 'Could not Logout';
 toast();
 });
 };
 $scope.login = function () {
 $state.go('login');
 };
 });
 */

app.controller('playlistsCtrl',
    ['$scope', '$http', '$state', '$sessionStorage', function ($scope, $http, $state, $sessionStorage) {
        var refresh = function () {
            $http({
                method: 'GET',
                url: "/api/playlists"
            }).then(function success(res) {
                console.log(res);
                $scope.playlists = res.data;
            }, function fail() {
            });
        };
        refresh();
        $scope.openPlaylist = function (name) {
            $sessionStorage.currentPlaylistName = name;
            $state.go('playlist');
        };
        $scope.addPlaylist = function () {
            $http({
                method: 'POST',
                url: "/api/playlists",
                data: {
                    name: $scope.playlistName,
                    nameOfUser: 'Praveen',
                    username: 'mishal23'
                }
            }).then(function success(res) {
                console.log(res);
                refresh();
            }, function fail() {
            });
        }
    }]);

app.controller('playlistCtrl',
    ['$scope', '$sessionStorage', '$http', '$sce', function ($scope, $sessionStorage, $http, $sce) {


        $scope.trustUrl = function (url) {
            return $sce.trustAsResourceUrl('https://www.youtube.com/embed/' + url);
        };
        $scope.playlistName = $sessionStorage.currentPlaylistName;
        $scope.playAllButton = function () {
            $scope.playAllUrl = $scope.songs[0] + "?playlist=";

            for (id in $scope.songs) {
                if (id > 0)
                    $scope.playAllUrl += $scope.songs[id];
            }
            $scope.playAllUrl += "&autoplay=1";
        };
        var refreshPlaylist = function () {

            $http({
                method: 'GET',
                url: '/api/playlists/' + $sessionStorage.currentPlaylistName
            }).then(function success(res) {
                console.log(res);
                $scope.songs = res.data.songs;


                /*for(var i=0;i<$scope.songs.length;i++){
                 $scope.songs[i].trustedUrl=$sce.trustAsResourceUrl($scope.songs[i]);
                 console.log($scope.songs[i]);
                 console.log($scope.songs[i].trustedUrl);
                 }*/

            }, function fail() {
                console.log('Gadhe');
            });
        };
        refreshPlaylist();

        $scope.addSong = function () {

            var link = $scope.songUrl;
            // var id=(link.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/));
            var id = link.split("&")[0];
            id = id.split("/");
            id = id.pop().split("=");
            //console.log(id.pop());
            link = id.pop();
            console.log(link);

            /*   if(id!==null) {
             id = id[1].split("/");

             if (id.length === 2) {
             //$('#video').show();
             console.log(id[1]);

             ' + id[1];
             $scope.songUrl = "";
             }
             else if (id.length === 1) {
             //$('#video').show();
             console.log(id[0]);
             link = 'https://www.youtube.com/embed/' + id[0];
             $scope.songUrl = "";
             }
             $http({
             method: 'POST',
             url: '/api/playlists/' + $sessionStorage.currentPlaylistName,
             data: {song: $sce.trustAsResourceUrl(link)}
             }).then(function success(res) {
             console.log(res);
             //$scope.songUrl = '';
             refreshPlaylist();
             }, function fail() {
             console.log('yooo');
             });
             }
             else {
             console.log("Improper URL");
             $scope.songUrl = "";
             }
             */
            if ($scope.songUrl !== null && $scope.songUrl !== '') {
                $http({
                    method: 'POST',
                    url: '/api/playlists/' + $sessionStorage.currentPlaylistName,
                    data: {song: link}
                }).then(function success(res) {
                    //myService.toast("Added");
                    $scope.songUrl = "";
                    refreshPlaylist();
                }, function fail() {
                    console.log('yooo');
                });

            } else {
                // myService.toast("Kuch toh daal gadhe");
            }


        };

        $scope.deleteSong = function (song) {
            console.log(song);
            $http({
                method: 'POST',
                url: '/api/playlists/' + $sessionStorage.currentPlaylistName + '/delete',
                data: {song: song}
            }).then(function () {
                refreshPlaylist();
            }, function () {
                console.log('delete nhi hua');
            });
        }
    }]);
app.controller('loginCtrl',
    ['$scope', function ($scope) {
        $scope.loginGoogle = function () {
            function onSignIn(googleUser) {
                var profile = googleUser.getBasicProfile();
                console.log('ID: ' + profile.getId());
                console.log('Name: ' + profile.getName());
                console.log('Image URL: ' + profile.getImageUrl());
                console.log('Email: ' + profile.getEmail());
            }

            window.onSignIn = onSignIn;
        }
    }]);
