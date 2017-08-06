/**
 * Created by Praveen Gupta on 06-08-2017.
 */

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
        $scope.$on('event:google-plus-signin-success', function (event, authResult) {

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
                $state.reload();
            });
        };

    }]);