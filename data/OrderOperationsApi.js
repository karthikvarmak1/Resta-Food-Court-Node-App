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

var _clone = function (data) {
    return JSON.parse(JSON.stringify(data));
};

var orderSchema = new mongoose.Schema({
    vendorId : String,
    orderId : String,
    orderDetails : [],
    toPayAmount: Number,
    orderStatus: String,
    orderTime: Date,
    email: String
});

var Order = mongoose.model('Order', orderSchema);

var OrderApi = {
    saveOrder : function (order, callback){
        var newOrder = new Order(order);
        newOrder.save({},function(err, order){
            if(err){
                return callback(err);
            }else{
             //   console.log('order details after save : '+vendor);
                return callback(null, _clone(order));
            }
        });
    },
    getMaxOrderId : function(callback){
        // console.log('stertttttttttttttttt');
      Order.find({}, {}, {sort : {orderId : -1}, limit : 1}, function(err, data){
        if(err){
                return console.log(err);
            }else{
               // console.log('Max order id json : '+data);
                callback (null, _clone(data));
            }
        });
    },
    getPendingOrdersByVendorId : function(id, callback){
        Order.find({vendorId : id, orderStatus : "pending"}, function(err, data){
            if(err){
                return console.log(err);
            }else{
                callback (null, _clone(data));
            }
        });
    },
    getCompletedOrdersByVendorId : function(id, callback){
        Order.find({vendorId : id, orderStatus : "completed"}, function(err, data){
            if(err){
                return console.log(err);
            }else{
                callback (null, _clone(data));
            }
        });
    },
    getRejectedOrdersByVendorId : function(id, callback){
        Order.find({vendorId : id, orderStatus : "rejected"}, function(err, data){
            if(err){
                return console.log(err);
            }else{
                callback (null, _clone(data));
            }
        });
    },
    getPendingOrAcceptedOrdersByVendorId : function(id, callback){
        Order.find({vendorId : id, $or: [{orderStatus : 'pending'}, {orderStatus : 'accepted'}]}, function(err, data){
            if(err){
                return console.log(err);
            }else{
                callback (null, _clone(data));
            }
        });
    },
    getOrderByOrderId :  function(id, callback){
        console.log('mongo....... '+id);
        Order.find({orderId : id}, function(err, data){
            if(err){
                return console.log(err);
            }else{
                callback (null, _clone(data));
            }
        });
    },
    updateOrderById : function(id, order, callback){
        Order.update({orderId : id},{$set : order},function(err, data){
            if(err){
                return console.log(err);
            }else{
                return callback (null, _clone(data));
            }
        });
    }
};

module.exports = OrderApi;
