var multer = require('multer');
var fs = require('fs');
var crypto = require("crypto");
var DIR = './vendorimages/';

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

var VendorApi = require('../data/VendorOperationsApi');
var express = require('express');
var router = express.Router();

router.get('/', function(req,res){
    VendorApi.getAllVendors(function(err,data){
        if(err){
            res.send(err);
        }
        res.json(data);
    });
});

router.post('/savevendor', function (req, res) {
    var vendor = {};
    vendor.vendorId = req.body.vendorId;
    vendor.vendorName = req.body.vendorName;
    vendor.menuCategories = req.body.menuCategories;
    vendor.cuisine = req.body.cuisine;
    vendor.type = req.body.type;
    vendor.openingtime = req.body.openingtime;
    vendor.closingtime = req.body.closingtime;
    vendor.workingday = req.body.workingday;
    vendor.profileUrl= req.body.profileUrl;
    vendor.gst = req.body.gst;
    console.log('Registered user in Node : '+JSON.stringify(vendor, null, 4));
   VendorApi.saveVendor(vendor, function (err, vendor) {
        if(err){
            console.log(err);
            res.status(500).json({ error: "saving vendor call failed", err: err});    
        }else{
            res.json(vendor);
        }
    });
});

router.put('/updatevendor/:id', function (req, res) {
    var vendor = {};
    vendor.vendorId = req.body.vendorId;
    vendor.vendorName = req.body.vendorName;
    vendor.menuCategories = req.body.menuCategories;
    vendor.cuisine = req.body.cuisine;
    vendor.type = req.body.type;
    vendor.openingtime = req.body.openingtime;
    vendor.closingtime = req.body.closingtime;
    vendor.workingday = req.body.workingday;
    vendor.profileUrl= req.body.profileUrl;
    vendor.gst = req.body.gst;
    console.log('Registered user in Node(updating vendor) : '+JSON.stringify(vendor, null, 4));
    VendorApi.updateVendorById(req.params.id, vendor, function (err, vendor) {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "updating vendor call failed", err: err });
        } else {
            res.json(vendor);
        }
    });
});

router.get('/fetch/:id', function(req,res){
    VendorApi.getVendorById(req.params.id, function(err,data){
        if(err){
            res.send(err);
        }
        res.json(data);
    });
});

router.post('/upload', upload.any(), function (req, res, next) {
    res.status(200).send({ 'msg': 'File uploaded' });
});

module.exports = router;