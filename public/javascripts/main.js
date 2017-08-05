/**
 * Created by Praveen Gupta on 19-07-2017.
 */

var app = angular.module('youtubePlaylist', ['ui.router', 'ngStorage', 'directive.g+signin','ngclipboard']);

app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');

    $stateProvider
        .state('home',
            {
                url: '/home',
                templateUrl: './templates/home.html'
            })
        .state('playlists',
            {
                url: '/playlists',
                templateUrl: './templates/playlists.html'
            })
        .state('playlist',
            {
                url: '/playlist',
                templateUrl: './templates/playlist.html'
            })
        .state('search',
            {
                url:'/search',
                templateUrl:'./templates/search.html'
            });
});



