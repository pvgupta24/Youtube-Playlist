/**
 * Created by Praveen Gupta on 19-07-2017.
 */
var express = require('express');
var router = express.Router();
var Playlist = require('../models/playlist');

router.route("/")
//Lists all playlists
    .get(function (req, res) {

        Playlist.find({}, 'name -_id', function (err, playlists) {
            if (err) {
                console.log(err);
                res.send("Error" + err);
            }
            else {
                console.log(playlists);
                res.send(playlists);
            }
        });
    })
    //Adds a new playlist
    .post(function (req, res) {
        console.log("1ecae");
        var playlistData = req.body;
        var newPlaylist = new Playlist(playlistData);
        console.log("2ascsdc");

        newPlaylist.save(function (err) {
            console.log("4fes");
            if (err) {
                console.log(err);
                res.send(err);
            }
            else {
                console.log("New Playlist created :" + playlistData.name);
                res.send("New Playlist created :" + playlistData.name);
            }
        })
    });

router.route("/:playlist")
//Displays playlist information including list of songs
    .get(function (req, res) {
        Playlist.findOne({name: req.params.playlist}, function (err, playlist) {
            if (err) {
                console.log(err);
                res.send(err);
            }
            else {
                console.log(req.params.playlist + "k" + playlist);
                res.send(playlist);
            }
        })
    })

    .post(function (req, res) {
        //Adds a new song to the playlist
        Playlist.findOneAndUpdate({name: req.params.playlist},
            {$push: {songs: req.body.song}},
            //{$set: {updated: new Date()}}},
            function (err, playlist) {
                if (err) {
                    console.log(req.body.song);
                    console.log("egf" + err);
                    res.send(err);
                }
                else {
                    console.log(req.body.song);
                    console.log("fh" + playlist);
                    res.send(playlist);
                }
            })
    });

//Gets all public playlists
router.route('/public').get(function (req, res) {
    Playlist.find({public: true}, function (err, playlists) {
        if (err) {
            res.send(err);
        }
        else {
            res.send(playlists);
        }
    });
});

module.exports = router;