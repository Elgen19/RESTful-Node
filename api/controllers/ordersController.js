const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const mongoose = require('mongoose');


exports.orders_get_All = (req, res, next)=>{
    Order.find()
    .select('_id quantity product')
    .populate('product', 'name')
    .exec()
    .then(doc=>{
        res.status(200).json({
            count: doc.length,
            orders: doc.map(docs=>{
               return{
                _id: docs._id,
                product: docs.product,
                quantity: docs.quantity,
                request: {
                    type: 'GET',
                    url: "http://localhost:3000/orders/" + docs._id
                }
               }

            }),
          
        })
    })
    .catch(err =>{
        console.log(err)
        res.status(500).json({error: err})
    })
}

exports.create_order = (req, res, next)=>{
    Product.findById(req.body.productId)
    .then(product =>{
        if (!product){
            return res.status(404).json({
                message: "Product not found!"
            })
        }
        const order = new Order({
            _id: new mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        });
        return   order.save();
    
    })
    .then(result=>{
        console.log(result);
        res.status(201).json({
            message: "Orders saved!",
            createdOrders: {
                _id: result._id,
                product: result.product,
                quantity: result.quantity,
                request:{
                    type: 'GET',
                    url: "url: http://localhost:3000/orders/" + result._id
                }
            }

            
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error: err})
    })

  

}

exports.get_individual_order = (req, res, next)=>{
    Order.findById(req.params.orderId)
    .populate('product')
    .exec()
    .then(order =>{
        if(!order){
            res.status(404).json({
                message: "No order found for the given ID"
            })
        }

        res.status(200).json({
            order: order,
            request:{
                type: 'GET',
                url: 'http://localhost:3000/orders/' 
            }
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
}

exports.delete_specific_order = (req, res, next)=>{
    Order.deleteOne({_id: req.params.orderId})
    .exec()
    .then(result=>{
     res.status(200).json({
         message: "Order Deleted",
         request:{
             type:'POST',
             url:'http://localhost:3000/orders/',
             body:{
                 productId: "ID",
                 quantity: "Number"
             }
         }
     })
    })
    .catch(err=>{
         res.status(500).json({
             error: err
         })
    })
 }