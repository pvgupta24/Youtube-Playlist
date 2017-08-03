/**
 * Created by Praveen Gupta on 03-08-2017.
 */

app.controller('playlistsCtrl',
    ['$scope', '$http', '$state', '$sessionStorage', function ($scope, $http, $state, $sessionStorage) {
         $scope.newPlaylistDetails = {};
        $scope.newPlaylistDetails.publicCheckBox=true;
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
        // $scope.newPlaylistDetails={publicCheckBox:false};

        $scope.openPlaylist = function (name) {
            $sessionStorage.currentPlaylistName = name;
            $state.go('playlist');
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
                        nameOfUser: $sessionStorage.user.name,
                        email: $sessionStorage.user.email,
                        public: $scope.newPlaylistDetails.publicCheckBox
                    }
                }).then(function success(res) {
                    console.log(res);
                    refresh();
                }, function fail() {
                });
            }
            else {
                console.log('Login First bro!');
            }
        }
    }]);
