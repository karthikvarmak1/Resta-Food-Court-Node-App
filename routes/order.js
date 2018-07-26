var OrderApi = require('../data/OrderOperationsApi');
var express = require('express');
var router = express.Router();

//This route is only for testing
router.get('/', function(req,res){
    res.json({Hi : 'karthik in order route'}); 
});

router.post('/saveorder', function (req, res) {
    var newOrder = req.body;
   // console.log('Hi printing request body : '+JSON.stringify(req.body,null,4));
    OrderApi.getMaxOrderId(function(err, data){
        if(err){
            console.log('In error block of fetching max id : '+err);
            res.send(err);
        }else{
            if(data!=''){
              //  console.log('In data block of fetching max id : '+JSON.stringify(data,null,4));
                newOrder.orderId = parseInt(data[0].orderId) + 1;
               // console.log(newOrder);
               OrderApi.saveOrder(newOrder, function (err, order) {
                // res.end();
                if (err) {
                    console.log(err);
                    res.status(500).json({ error: "save order call failed", err: err });
                } else {
                   // console.log('Hi printing order to check max id : ' + JSON.stringify(order, null, 4));
                    res.json(order);
                }
            });
            }else{
                // If no orders are there, setting the order number to  1500000000.
                newOrder.orderId = parseInt(1500000000);
                // console.log(newOrder);
                // console.log('No data block');
                OrderApi.saveOrder(newOrder, function (err, order) {
                    // res.end();
                    if (err) {
                        console.log(err);
                        res.status(500).json({ error: "save order call failed", err: err });
                    } else {
                       // console.log('Hi printing order to check max id : ' + JSON.stringify(order, null, 4));
                        res.json(order);
                    }
                });
            }
        }
    });
});

router.put('/updateorder/:id', function (req, res) {
    var updatedOrder = req.body;
    delete updatedOrder._id;
    delete updatedOrder.__v;
    // console.log('Updated Order in Node : '+JSON.stringify(updatedOrder, null, 4));
    // console.log('Test : '+req.params.id);
    OrderApi.updateOrderById(req.params.id, updatedOrder, function (err, data) {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "updating order call failed", err: err });
        } else {
            res.json(data);
        }
    });
});

router.get('/fetch/:id', function(req,res){
    OrderApi.getPendingOrdersByVendorId(req.params.id, function(err,data){
        if(err){
            res.send(err);
        }else{
            res.json(data);
        }
    });
});

router.get('/fetchorder/:id', function(req,res){
    OrderApi.getOrderByOrderId(req.params.id, function(err,data){
        if(err){
            res.send(err);
        }else{
            res.json(data);
        }
    });
});

router.get('/fetchcompleted/:id', function(req,res){
    OrderApi.getCompletedOrdersByVendorId(req.params.id, function(err,data){
        if(err){
            res.send(err);
        }else{
            res.json(data);
        }
    });
});

router.get('/fetchrejected/:id', function(req,res){
    OrderApi.getRejectedOrdersByVendorId(req.params.id, function(err,data){
        if(err){
            res.send(err);
        }else{
            res.json(data);
        }
    });
});

router.get('/fetchpendingoracceptedorders/:id', function(req,res){
    OrderApi.getPendingOrAcceptedOrdersByVendorId(req.params.id, function(err,data){
        if(err){
            res.send(err);
        }else{
            res.json(data);
        }
    });
});

module.exports = router;