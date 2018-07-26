"use strict";

var mongoose = require('mongoose');
var util = require('util');
var nodemailer = require('nodemailer');
var handlebars = require('handlebars');
var fs = require('fs');
var shortid = require('shortid');
var keys = require('../config/keys');

mongoose.Promise = global.Promise;
mongoose.connect(keys.MONGODB_URI);

var conn = mongoose.connection;

conn.on('error', function (err) {
    console.log('Connection error', err);
});
conn.once('open', function () {
    console.log('Connected to DB.');
});

var Schema = mongoose.Schema;

var registeredUserSchema = new mongoose.Schema({
    partnerId : String,
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    phone: String,
    location: String,
    profileUrl: String,
    userType: String
});

var RegisteredUser = mongoose.model('RegisteredUser', registeredUserSchema);

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'noreply.restapvtlimited@gmail.com',
        pass: 'Resta@123'
    }
});

var readHTMLFile = function (path, callback) {
    fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};

var _clone = function (item) {
    return JSON.parse(JSON.stringify(item));
};

var RegisteredUserApi = {
    saveRegisteredUser: function (registeredUser, callback) {
        registeredUser.partnerId = registeredUser.firstName+'_'+shortid.generate();
        var newUser = new RegisteredUser(registeredUser);
        newUser.userType='vendor';
        newUser.save({}, function (err, registeredUser) {
            if (err) {
                return callback(err);
            } else {
                console.log('Registered user in Mongo : '+JSON.stringify(registeredUser, null, 4));
                readHTMLFile(__dirname + '/pages/credentialsemailtemplate.html', function (err, html) {
                    var template = handlebars.compile(html);
                    // Right now sending the email as partner Id.....have to replace it with partner ID
                    var replacements = {
                        partnerId: registeredUser.partnerId,
                        password: registeredUser.password
                    };
                    var htmlToSend = template(replacements);
                    var mailOptions = {
                        from: 'noreply.restapvtlimited@gmail.com',
                        // to: 'roshni.kumari3@wipro.com,ankita.priya4@wipro.com,karthik.konduru@wipro.com',
                        // to : registeredUser.email,
                        to: newUser.email,
                        subject: 'Welcome to Resta.com',
                        html: htmlToSend
                    };
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            return console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });
                });
                console.log('RegisteredUser inserted successfully.....!!!');
                return callback(null, _clone(registeredUser));
            }
        });
    },
    validateLoggedInUser : function(loggedInUser, callback) {
        RegisteredUser.find(loggedInUser, function(err, data){
            if(err){
                return console.log(err);
            }else{
                console.log('Count of User details : '+data);
                return callback(null, _clone(data));
            }
        });
    },
    getProfileDetails : function(id, callback){
        RegisteredUser.find({partnerId : id}, function(err, data){
            if(err){
                return console.log(err);
            }else{
                callback (null, _clone(data));
            }
        });
    },
    updateProfile : function(id, user, callback){
        RegisteredUser.update({partnerId : id},{$set : user},function(err, data){
            if(err){
                return console.log(err);
            }else{
                return callback (null, _clone(data));
            }
        });
    }
}

module.exports = RegisteredUserApi;
