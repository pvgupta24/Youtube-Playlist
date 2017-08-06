/**
 * Created by Praveen Gupta on 06-08-2017.
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
                url: '/api/playlists/' + $sessionStorage.currentPlaylist.name,
                data: {song: id}
            }).then(function success(res) {
                $state.go('playlist');
                $rootScope.toast("Song added to "+$sessionStorage.currentPlaylist.name,1000);
            }, function fail() {
                console.log('Failed bro');
                $rootScope.toast("Could not add song to "+$sessionStorage.currentPlaylist.name+" ,Please try later",1000);
            });
        }
    }]);