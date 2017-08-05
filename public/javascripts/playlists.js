/**
 * Created by Praveen Gupta on 03-08-2017.
 */

app.controller('playlistsCtrl',
    ['$scope', '$http', '$state', '$sessionStorage','$sce', function ($scope, $http, $state, $sessionStorage,$sce) {
        $scope.newPlaylistDetails = {};
$scope.reload=function () {
    $state.reload();
};
        var refresh = function () {
            $http({
                method: 'GET',
                url: "/api/playlists/"+$sessionStorage.user.email
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
        $scope.getPlayAllUrl=function (songs) {
           // console.log(songs);
            var shuffledPlaylist = (songs);
            //console.log(shuffledPlaylist);

             var url = shuffledPlaylist[0] + "?playlist=";

            for (id in shuffledPlaylist) {
                if (id > 0)
                    url += shuffledPlaylist[id] + ',';
            }
            url.slice(0, -1);
            console.log(url);
            return $sce.trustAsResourceUrl("https://www.youtube.com/embed/" + url+'&cc_load_policy=1');
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
                        user: {name:$sessionStorage.user.name,
                            email: $sessionStorage.user.email,
                            imageUrl:$sessionStorage.user.imageUrl
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
                console.log('Login First bro!');
            }
        }
    }]);
