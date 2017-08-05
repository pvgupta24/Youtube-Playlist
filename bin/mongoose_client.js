var mongoose = require("mongoose");

var connectDB = function (callback, fallback) {

    var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
        replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };

    var mongodbUri = 'mongodb://pvgupta24:praveenNitk@ds129183.mlab.com:29183/youtube-playlist';
    mongoose.connect(mongodbUri, options);





   // mongoose.connect('mongodb://localhost:27017');
    var db = mongoose.connection;
    db.on('error',function (error) {
        fallback(error);
    });
    db.once('open',function (obj) {
        console.log("mongoose client: connect success");
        callback(obj);
    });
}

exports.connectDB = connectDB;/**
 * Created by Praveen Gupta on 19-07-2017.
 */
