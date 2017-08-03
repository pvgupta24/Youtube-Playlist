/**
 * Created by Praveen Gupta on 02-08-2017.
 */

app.controller('playlistCtrl',
    ['$state', '$scope', '$sessionStorage', '$http', '$sce', function ($state, $scope, $sessionStorage, $http, $sce) {


        $scope.trustUrl = function (url) {
            return $sce.trustAsResourceUrl('https://www.youtube.com/embed/' + url);
        };
        $scope.playlistName = $sessionStorage.currentPlaylistName;
        $scope.playAllButton = function () {
            refreshPlaylist();
            $scope.playAllUrl = $scope.songs[0] + "?playlist=";

            for (id in $scope.songs) {
                if (id > 0)
                    $scope.playAllUrl += $scope.songs[id] + ',';
            }
            $scope.playAllUrl.slice(0, -1);
            $scope.playAllUrl += "&autoplay=1";
        };
        $scope.shuffleAllButton = function () {
            refreshPlaylist();
            function shuffle(array) {
                var copy = [], n = array.length, i;

                // While there remain elements to shuffle…
                while (n) {

                    // Pick a remaining element…
                    i = Math.floor(Math.random() * n--);
                    // And move it to the new array.
                    copy.push(array.splice(i, 1)[0]);
                }

                return copy;
            }

            var shuffledPlaylist = shuffle($scope.songs);
            $scope.playAllUrl = shuffledPlaylist[0] + "?playlist=";

            for (id in shuffledPlaylist) {
                if (id > 0)
                    $scope.playAllUrl += shuffledPlaylist[id] + ',';
            }
            $scope.playAllUrl.slice(0, -1);
            $scope.playAllUrl += "&autoplay=1";
            console.log(shuffledPlaylist);
        };
        $scope.deletePlaylistButton = function () {
            console.log($sessionStorage.currentPlaylistName);
            $http({
                method: 'POST',
                url: '/api/playlists/' + $sessionStorage.currentPlaylistName + '/delete'
            }).then(function success(res) {
                console.log('deleted');
                console.log(res);
                $state.go('playlists');
            }, function fail(err) {
                console.log(err);
            });

        };
        var refreshPlaylist = function () {

            $http({
                method: 'GET',
                url: '/api/playlists/' + $sessionStorage.currentPlaylistName
            }).then(function success(res) {
                console.log(res);
                $scope.songs = res.data.songs;
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
            if ($scope.songs.includes(link)) {
                console.log('Already exists');
                $scope.songUrl="";
            }
           else {

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
        }

        };
        $scope.deleteSong = function (song) {
            console.log(song);
            $http({
                method: 'POST',
                url: '/api/playlists/' + $sessionStorage.currentPlaylistName + '/deleteSong',
                data: {song: song}
            }).then(function () {
                refreshPlaylist();
            }, function () {
                console.log('delete nhi hua');
            });

            $state.reload();
        };

        $scope.title = [];
        $scope.details = [];
        $scope.getSongDetails = function (id, index) {

            // var song = [{}];
            $http({
                method: 'GET',
                url: 'https://www.googleapis.com/youtube/v3/videos?id=' + id + '&key=AIzaSyDmD8pa2BTNiwvQ5LD-SNArhLYA1gCVQxY&part=snippet'
            }).then(function success(res) {
                $scope.title[index] = res.data.items[0].snippet.title.split("|")[0];
                $scope.details[index] = res.data.items[0].snippet.description.split("\n")[0];
                //console.log(song.title);
                // = song.description;
                //$scope.title = song.title;

            }, function fail(err) {
                console.log(err);
            });
            //console.log(song.title);
            //return song;
        }
    }]);
