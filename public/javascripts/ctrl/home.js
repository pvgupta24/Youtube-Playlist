/**
 * Created by Praveen Gupta on 19-07-2017.
 */


app.controller('homeCtrl',
    ['$sessionStorage', '$http', '$scope', '$state', '$rootScope', function ($sessionStorage, $http, $scope, $state, $rootScope) {
        $sessionStorage.currentPlaylist = {};
        $scope.openPlaylist = function (playlist) {
            $sessionStorage.currentPlaylist = playlist;
            $state.go('playlist');
            $rootScope.toast("Loading songs...", 700);
        };
        $scope.user = $sessionStorage.user;
        console.log($scope.user);
        $http({
            method: 'GET',
            url: '/api/playlists'
        }).then(function success(res) {
            $rootScope.toast("Loading playlists...", 600);
            $scope.playlists = res.data;

        }, function fail(err) {
            console.log(err);
            $rootScope.toast("Could not load playlists...", 900);
        });
        $scope.formatDate = function (d) {
            var date = d.split("-");
            return date[2].slice(0, 2) + " " + ["Jan", "Feb", "Mar", "Apr", "May", "June",
                    "July", "Aug", "Sep", "Oct", "Nov", "Dec"][parseInt(date[1])] + " " + date[0];
        };

    }]);
