var multer = require('multer');
var fs = require('fs');
var crypto = require("crypto");
var DIR = './uploads/';

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, DIR)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
        // crypto.pseudoRandomBytes(16, function (err, raw) {
           
        // });
    }
});

var upload = multer({storage: storage});

var RegisteredUserApi = require('../data/FoodCourtApi');
var express = require('express');
var router = express.Router();

//This route is only for testing
router.get('/', function (req, res) {
    res.json({ Hi: 'karthik' });
});

router.post('/saveregistration', function (req, res) {
    var registeredUser = {};
    registeredUser.firstName = req.body.firstName;
    registeredUser.lastName = req.body.lastName;
    registeredUser.email = req.body.email;
    registeredUser.password = req.body.password;
    registeredUser.phone = req.body.phone;
    registeredUser.location = req.body.location;
    console.log(req.body);
    // console.log('Registered user in Node : '+JSON.stringify(registeredUser, null, 4));
    RegisteredUserApi.saveRegisteredUser(registeredUser, function (err, registeredUser) {
        // res.end();
        if (err) {
            console.log(err);
            res.status(500).json({ error: "save registration failed", err: err });
        } else {
            res.json({ saveRegistration: 'success' });
        }
    });
});

router.post('/loginvalidation', function (req, res) {
    var loggedInUser = {};
    loggedInUser.partnerId = req.body.partnerId;
    loggedInUser.password = req.body.password;
    RegisteredUserApi.validateLoggedInUser(loggedInUser, function (err, data) {
        // res.end();
        if (err) {
            console.log(err);
            res.status(500).json({ error: "login validation failed", err: err });
        } else {
            res.json(data);
        }
    });
});

router.get('/fetchprofiledetails/:id', function (req, res) {
    RegisteredUserApi.getProfileDetails(req.params.id, function (err, data) {
        if (err) {
            res.send(err);
        } else {
            res.json(data);
        }
    });
});

router.post('/uploadprofile', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            return res.status(400).json({ message: 'Upload Request Validation Failed' });
        } else if (!req.body.name) {
            return res.status(400).json({ message: 'No Picture name in request body' });
        }
        var picName = req.body.name;
        // convert buffer to readable stream
        var readableTrackStream = new Readable();

        readableTrackStream.push(req.file.buffer);
        readableTrackStream.push(null);

        var writestream = gfs.createWriteStream({ 
            filename: picName,
            mode:'w'
        });
        var id = writestream.id;
        readableTrackStream.pipe(writestream);

        writestream.on('error', function (err) {
            return res.status(500).json({ message: 'Error uploading file' });
        }).on('finish', function () {
            return res.status(201).json({ message: 'File uploaded successfully, stored under Mongo ObjectID ' + id });
        });
    });
});

router.post('/upload', upload.any(), function (req, res, next) {
    res.status(200).send({ 'msg': 'File uploaded' });
});

router.put('/updateprofile/:id', function (req, res) {
    // console.log('Updated Order in Node : '+JSON.stringify(updatedOrder, null, 4));
    // console.log('Test : '+req.params.id);
    var userProfile = req.body;
    delete userProfile._id;
    delete userProfile.__v;
    RegisteredUserApi.updateProfile(req.params.id, userProfile, function (err, data) {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "updating profile call failed", err: err });
        } else {
            res.json(data);
        }
    });
});

module.exports = router;

// var mongoose = require('mongoose');
// var multer = require('multer');
// var Grid = require('gridfs-stream');
// Grid.mongo = mongoose.mongo;
// var Readable = require('stream').Readable;
// var GridFsStorage = require('multer-gridfs-storage');

// mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost:27050/FoodCourtDatabase');
// var conn = mongoose.connection;
// conn.once('open', function () {
//     console.log('Connected to DB.');
// });
// conn.on('error', function (err) {
//     console.log('Connection error', err);
// });
// var busboy = require('connect-busboy');
// var app = express();
// app.use(busboy());

// var gfs = Grid("FoodCourtDatabase");

// var storage = GridFsStorage({
//     url: 'mongodb://localhost:27050/FoodCourtDatabase',
//     gfs: gfs,
//     file: function (req, file) {
//         console.log('file : '+JSON.stringify(file,null,4));
//         return { 
//             filename: req.body.name
//         };
//     }
// });

// // multer settings for single upload
// var upload = multer({
//     storage: storage
// }).single('profilepict');
