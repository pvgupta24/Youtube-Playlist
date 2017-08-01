/**
 * Created by Praveen Gupta on 19-07-2017.
 */

app.controller('homeCtrl',
    ['$sessionStorage', '$http', '$scope', function ($sessionStorage, $http, $scope) {
        var url = '/api/playlists/public';
        if ($sessionStorage.user.loggedIn) {
            url = '/api/playlists/' + $sessionStorage.user.email + '/orPublic';
        }
        console.log(url);
        $http(
            {
                method: 'GET',
                url: url
            }).then(function success(res) {
            console.log('Success mei ghusa');
            console.log(res);
            $scope.playlists = res.data;
        }, function fail(err) {
            console.log(err);
        });

    }]);
app.controller('playlistsCtrl',
    ['$scope', '$http', '$state', '$sessionStorage', function ($scope, $http, $state, $sessionStorage) {
        $scope.newPlaylistDetails = {publicCheckBox: true};
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
                url: '/api/playlists/' + $sessionStorage.currentPlaylistName + '/deleteSong',
                data: {song: song}
            }).then(function () {
                refreshPlaylist();
            }, function () {
                console.log('delete nhi hua');
            });
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

app.controller('loginCtrl',
    ['$scope', '$window', '$sessionStorage', '$state', function ($scope, $window, $sessionStorage, $state) {

        if ($sessionStorage.user.loggedIn)
            $scope.hideLoginButton = true;

        $scope.signOut = function () {

            var auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut().then(function () {
                console.log('User signed out.');
                $scope.hideLoginButton = false;
                $sessionStorage.user = {};
                $state.reload();

            });


        };
        $scope.signIn = function () {
            $sessionStorage.user = $window.user;
            $scope.user = $window.user;
            //console.log(user);
            console.log($sessionStorage.user);
            $scope.hideLoginButton = true;
            $state.reload();
        };
    }]);

var profile, user;
function onSignIn(googleUser) {

    profile = googleUser.getBasicProfile();
    /* console.log('ID: ' + profile.getId());
     console.log('Name: ' + profile.getName());
     console.log('Image URL: ' + profile.getImageUrl());
     console.log('Email: ' + profile.getEmail());*/
    user = {
        loggedIn: true,
        id: profile.getId(),
        name: profile.getName(),
        imageUrl: profile.getImageUrl(),
        email: profile.getEmail()
    };
}
