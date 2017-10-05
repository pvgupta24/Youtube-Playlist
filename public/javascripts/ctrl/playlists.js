/**
 * Created by Praveen Gupta on 03-08-2017.
 */

app.controller('playlistsCtrl',
    ['$scope', '$http', '$state', '$sessionStorage', '$sce', '$rootScope',
        function ($scope, $http, $state, $sessionStorage, $sce, $rootScope) {
            $scope.newPlaylistDetails = {};
            $sessionStorage.currentPlaylist = {};
            $scope.user=$sessionStorage.user;
            $scope.reload = function () {
                $state.reload();
            };
            var refresh = function () {
                $http({
                    method: 'GET',
                    url: "/api/playlists/email/" + $sessionStorage.user.email
                }).then(function success(res) {
                    console.log(res);
                    $scope.playlists = res.data;
                }, function fail() {
                });
            };
            refresh();
            $scope.shuffleAllButton = function () {
                $rootScope.playAllUrl = shuffledPlaylist[0] + "?playlist=";

                for (id in shuffledPlaylist) {
                    if (id > 0)
                        $rootScope.playAllUrl += shuffledPlaylist[id] + ',';
                }
                $rootScope.playAllUrl.slice(0, -1);
                $rootScope.playAllUrl += "&autoplay=1";
            };

            $scope.openPlaylist = function (playlist) {

                $sessionStorage.currentPlaylist = playlist;
                $state.go('playlist');
                $rootScope.toast("Opening your playlist...", 1000);
            };
            $scope.getPlayAllUrl = function (songs) {
                var shuffledPlaylist = (songs);
                var url = shuffledPlaylist[0] + "?playlist=";
                for (id in shuffledPlaylist) {
                    if (id > 0)
                        url += shuffledPlaylist[id] + ',';
                }
                url.slice(0, -1);
                return $sce.trustAsResourceUrl("https://www.youtube.com/embed/" + url );
            };
            $scope.addPlaylist = function () {

                console.log($scope.newPlaylistDetails.publicCheckBox);
                if ($sessionStorage.user.loggedIn) {
                    console.log('Trying to create playlist');
                    $http({
                        method: 'POST',
                        url: "/api/playlists",
                        data: {
                            name: $scope.newPlaylistDetails.playlistName,
                            user: {
                                name: $sessionStorage.user.name,
                                email: $sessionStorage.user.email,
                                imageUrl: $sessionStorage.user.imageUrl
                            },
                            public: $scope.newPlaylistDetails.publicCheckBox
                        }
                    }).then(function success(res) {
                        console.log(res);
                        refresh();
                    }, function fail() {
                    });
                }
                else {
                    $rootScope.toast("Login to add playlist !",800);
                    console.log('Login First bro!');
                }
            }
        }]);
