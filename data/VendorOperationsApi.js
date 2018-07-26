"use strict";

var mongoose = require('mongoose');
var util = require('util');
var fs = require('fs');
var keys = require('../config/keys');

mongoose.Promise = global.Promise;
mongoose.connect(keys.MONGODB_URI);

var db = mongoose.connection;

db.on('error', function (err) {
    console.log('Connection error', err);
});
db.once('open', function () {
    console.log('Connected to DB.');
});

var Schema = mongoose.Schema;

var _clone = function (user) {
    return JSON.parse(JSON.stringify(user));
};

var vendorSchema = new mongoose.Schema({
    vendorId : String,
    vendorName : String,
    menuCategories : [],
    cuisine: [],
    type: [],
    openingtime: String,
    closingtime: String,
    workingday: [],
    profileUrl: String,
    gst: Number
});

var Vendor = mongoose.model('Vendor', vendorSchema);

var VendorApi = {
    saveVendor : function (vendor, callback){
        var newVendor = new Vendor(vendor);
        newVendor.save({},function(err, vendor){
            if(err){
                return callback(err);
            }else{
                console.log('vendor details after save : '+vendor);
                return callback(null, _clone(vendor));
            }
        });
    },
    updateVendorById : function(id, vendor, callback){
        Vendor.update({vendorId : id},{ $set : vendor},function(err, data){
            if(err){
                return console.log(err);
            }else{
                console.log('Vendor updated successfully with id : '+id);
                return callback (null, _clone(data));
            }
        });
    },
    getVendorById : function(id, callback){
        Vendor.find({vendorId : id}, function(err, data){
            if(err){
                return console.log(err);
            }else{
                console.log('Data fetched Successfully with id : '+id);
                callback (null, _clone(data));
            }
        });
    },
    getAllVendors : function(callback){
        Vendor.find({}, function(err, data){
            if(err){
                return console.log(err);
            } else {
                return callback(null,_clone(data));
            }
        });
    }
}

module.exports = VendorApi;



