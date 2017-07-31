/**
 * Created by Praveen Gupta on 19-07-2017.
 */

app.controller('homeCtrl',
    ['$sessionStorage', '$http', '$scope', function ($sessionStorage, $http, $scope) {
        var url;
        if ($sessionStorage.user.loggedIn) {
            url = '/api/playlists/' + $sessionStorage.user.email + '/orPublic';
        }
        else {
            console.log('not logged in');
            url = '/api/playlists/public';
        }
        $http(
            {
                method: 'GET',
                url: url
            }
        ).then(function success(res) {
            console.log('Success mei ghusa');
            console.log(res);
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
        $scope.getSongDetails = function (id) {
            console.log(id);
            var song = {};
            $http({
                method: 'GET',
                url: 'https://www.googleapis.com/youtube/v3/videos?id=Wd2B8OAotU8&key=AIzaSyDmD8pa2BTNiwvQ5LD-SNArhLYA1gCVQxY&part=snippet'
                // + id + '&key=AIzaSyDmD8pa2BTNiwvQ5LD-SNArhLYA1gCVQxY&part=snippet'
            }).then(function success(res) {
                song.title = res.data.items[0].snippet.title.split("|")[0];
                song.description = res.data.items[0].snippet.description.split("\n")[0];
                console.log(song.title);
                console.log(song.description);
            }, function fail(err) {
                console.log(err);
            });
            return song;
        }
    }]);

app.controller('loginCtrl',
    ['$scope', '$window', '$sessionStorage', function ($scope, $window, $sessionStorage) {
        $scope.signOut = function () {

            var auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut().then(function () {
                console.log('User signed out.');
                $scope.hideLoginButton = false;
                $sessionStorage.user = {};
            });
        };
        $scope.signIn = function () {
            //console.log('yoooooooo' + $window.profile.getEmail());
            /* $sessionStorage.user = {
             loggedIn: true,
             id: $window.profile.getId(),
             name: $window.profile.getName(),
             imageUrl: $window.profile.getImageUrl(),
             email: $window.profile.getEmail()
             };*/
            $sessionStorage.user = $window.user;
            console.log($sessionStorage.user);
            $scope.hideLoginButton = true;
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
