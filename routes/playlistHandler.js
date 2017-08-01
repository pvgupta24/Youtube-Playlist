/**
 * Created by Praveen Gupta on 19-07-2017.
 */
var express = require('express');
var router = express.Router();
var Playlist = require('../models/playlist');

//Lists all playlists
router.route("/").get(function (req, res) {

    Playlist.find({}, '-__v', function (err, playlists) {
        if (err) {
            console.log("Error" + err);
            res.send(err);
        }
        else {
            console.log("All Playlists:\n" + playlists);
            res.send(playlists);
        }
    });
});
//Gets all public playlists
router.route("/public").get(function (req, res) {
    console.log('aaya');
    Playlist.find({public: true}, function (err, playlists) {
        if (err) {
            console.log('Error' + err);
            res.send(err);
        }
        else {
            console.log('sending public playlists');
            res.send(playlists);
        }
    });
});

//Adds a new playlist
router.route("/").post(function (req, res) {
    var playlistData = req.body;
    var newPlaylist = new Playlist(playlistData);

    newPlaylist.save(function (err) {
        if (err) {
            console.log("Error:" + err);
            res.send(err);
        }
        else {
            console.log("New Playlist created :" + playlistData.name);
            res.send(playlistData.name);
        }
    })
});

//Delete a playlist
router.route("/:playlist/delete").post(function (req, res) {
    console.log("to b deleted" + req.params.playlist);
    Playlist.findOneAndRemove({name: req.params.playlist}, function (err, removedCount) {
        res.send(err);
    });
});

//Displays playlist information including list of songs
router.route("/:playlist").get(function (req, res) {
    Playlist.findOne({name: req.params.playlist}, function (err, playlist) {
        if (err) {
            console.log("Error:" + err);
            res.send(err);
        }
        else {
            console.log(req.params.playlist + 'information :\n' + playlist);
            res.send(playlist);
        }
    })
});

//Adds a new song to the playlist
router.route("/:playlist").post(function (req, res) {
    Playlist.findOneAndUpdate({name: req.params.playlist},
        {$push: {songs: req.body.song}},
        function (err, playlist) {
            if (err) {
                res.send(err);
            }
            else {
                console.log(req.body.song + " added to " + playlist);
                res.send(playlist);
            }
        });
});
//Delete a song from playlist
router.route("/:playlist/deleteSong").post(function (req, res) {
    console.log("yooooooooooooooooooooooooo" + req);
    Playlist.findOneAndUpdate({name: req.params.playlist},
        {$pull: {songs: req.body.song}},
        function (err, playlist) {
            if (err) {
                res.send(err);
            }
            else {
                console.log(req.body.song + " removed from " + playlist);
                res.send(playlist);
            }
        });
});



//Gets all playlists with the given username
router.route('/:username').get(function (req, res) {
    Playlist.find({username: req.params.username}, function (err, playlists) {
        if (err) {
            console.log("Error:" + err);
            res.send(err);
        }
        else {
            console.log("Playlists for " + req.params.username + ":\n" + playlists);
            res.send(playlists);
        }
    });
});

//Gets all public playlists plus playlists with the given username
router.route('/:username/orPublic').get(function (req, res) {
    Playlist.find({$or: [{username: req.params.username}, {public: true}]}, function (err, playlists) {
        if (err) {
            console.log("Error:" + err);
            res.send(err);
        }
        else {
            console.log("Playlists for " + req.params.username + " & public playlists:\n" + playlists)
            res.send(playlists);
        }
    });
});

module.exports = router;