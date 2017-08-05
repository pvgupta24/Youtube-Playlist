/**
 * Created by Praveen Gupta on 19-07-2017.
 */
app.controller('searchCtrl', ['$sessionStorage', '$scope', '$sce', '$http', '$state','$rootScope',
    function ($sessionStorage, $scope, $sce, $http, $state,$rootScope) {
    $scope.trustUrl = function (url) {
        return $sce.trustAsResourceUrl('https://www.youtube.com/embed/' + url);
    };
    $scope.searchInfo = $sessionStorage.searchInfo;
    $scope.searchFromAddState = $sessionStorage.searchFromAddState;
    $scope.addSong = function (id) {
        $http({
            method: 'POST',
            url: '/api/playlists/' + $sessionStorage.currentPlaylistName,
            data: {song: id}
        }).then(function success(res) {
            $state.go('playlist');
            $rootScope.toast("Song added to "+$sessionStorage.currentPlaylistName,1000);
        }, function fail() {
            console.log('Failed bro');
            $rootScope.toast("Could not add song to "+$sessionStorage.currentPlaylistName+" ,Please try later",1000);
        });
    }
}]);

app.controller('homeCtrl',
    ['$sessionStorage', '$http', '$scope', '$state','$rootScope', function ($sessionStorage, $http, $scope, $state,$rootScope) {

        $scope.openPlaylist = function (name) {
            $sessionStorage.currentPlaylistName = name;
            $state.go('playlist');
            $rootScope.toast("Loading songs...",1000);
        };
        $scope.user = $sessionStorage.user;
        console.log($scope.user);
        $http({
                method: 'GET',
                url: '/api/playlists'
            }).then(function success(res) {
            console.log('Success mei ghusa');
            // console.log(res);
            $rootScope.toast("Loading playlists...",1000);
            $scope.playlists = res.data;

        }, function fail(err) {
            console.log(err);
            $rootScope.toast("Could not load playlists...",1000);
        });
        $scope.formatDate = function (d) {
            var date = d.split("-");
            return date[2].slice(0, 2) + " " + ["Jan", "Feb", "Mar", "Apr", "May", "June",
                    "July", "Aug", "Sep", "Oct", "Nov", "Dec"][parseInt(date[1])] + " " + date[0];
        };

    }]);

app.controller('headerCtrl',
    ['$scope', '$window', '$sessionStorage', '$state', '$http','$rootScope', function ($scope, $window, $sessionStorage, $state, $http,$rootScope) {
        $rootScope.toast=function (msg,time) {
            $rootScope.toastMsg = msg;
            $myToast=$('#myToast');
            $myToast.modal('show');
            setTimeout(function() { $myToast.modal('hide'); }, time);
        };

    if ($sessionStorage.searchInfo === undefined)
            $sessionStorage.searchInfo = [];
        $scope.search = function (searchInput) {
            if (searchInput !== "" && searchInput !== undefined) {
                $http({
                    method: 'GET',
                    url: 'https://www.googleapis.com/youtube/v3/search?part=snippet&q=' + searchInput + '&maxResults=12&order=viewCount&key=AIzaSyDmD8pa2BTNiwvQ5LD-SNArhLYA1gCVQxY'
                }).then(function success(res) {
                    $rootScope.toast("Searching for songs...",1500);
                    console.log("searching for song request");
                    console.log(res.data.items);
                    $sessionStorage.searchInfo = [];
                    $sessionStorage.searchFromAddState = ($state.current.name === 'playlist');
                    for (i in res.data.items) {
                        if (res.data.items[i].id.videoId !== undefined) {
                            $sessionStorage.searchInfo.push({
                                id: res.data.items[i].id.videoId,
                                title: res.data.items[i].snippet.title
                            })
                        }
                    }
                    if ($state.current.name === 'search')
                        $state.reload();
                    else
                        $state.go('search');


                }, function fail() {
                    console.log('failed to search');
                    $rootScope.toast("Could not search song...",1000);
                });
            }
        };
        if ($sessionStorage.user === undefined)
            $sessionStorage.user = {};
        if ($sessionStorage.user.loggedIn === true)
            $scope.user = $sessionStorage.user;
        else {
            $scope.user = {};
            $scope.user.loggedIn = false;
        }
        $scope.hideLoginButton = $scope.user.loggedIn;
        // console.log($sessionStorage.user.loggedIn);
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
            console.log($scope.user);$state.reload();
            $scope.hideLoginButton = $sessionStorage.user.loggedIn;




        });
        $scope.$on('event:google-plus-signin-failure', function (event, authResult) {
            // Auth failure or signout detected
            $rootScope.toast("Could not Login, Please try again!",1000);
            console.log("Could not LOGIN ....");
            console.log(authResult);

        });

        $scope.signOut = function () {
            var auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut().then(function () {

                $rootScope.toast("Signing Out",1000);
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
