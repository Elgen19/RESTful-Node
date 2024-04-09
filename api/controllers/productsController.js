const Product = require('../models/productModel')
const mongoose = require('mongoose')


exports.get_all_products = (req, res, next)=>{
    Product.find()
    .select('name price _id productImage')
    .exec()
    .then(doc=>{
       const response = {
        count: doc.length,
        products: doc.map(docs =>{
            return{
                name: docs.name,
                price: docs.price,
                _id: docs.id,
                productImage: docs.productImage,
                request: {
                    type: 'GET',
                    url: 'http://localhost/3000/products/' + docs.id
                }
            }
        })
       }
        res.status(200).json(response);     
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({error: err})
    })
   
}

exports.create_product =  (req, res, next)=>{
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product.save()
    .then(result =>{
        console.log(result);
         res.status(200).json({
        message: "Product created successfully!",
        product: {
            name: result.name,
            price: result.price,
            _id: result.id,
            request: {
                type: 'POST',
                url: 'http://localhost:3000/products/' + result.id
            }
        }
    });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });

   
}

exports.get_individual_products = (req, res, next)=>{
    const id = req.params.productId;
    Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then(doc =>{
     console.log("From database: " + doc);
     res.status(200).json({
         message: 'Product retrieved!',
         product: doc,
         request: {
             type: 'GET',
             url: 'http"//localhost:3000/products/'+ doc.id
         }
     })
 
    })
    .catch(err =>{
     console.log(err);
     res.status(500).json({
         error: err
     })
    })
 }

 exports.update_product_information = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.updateOne({ _id: id }, { $set: updateOps }) // Using updateOne() instead of update()
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: "Product Updated!",
                request: {
                    type: 'GET',
                    url: 'http"//localhost:3000/products/'+ id
                }
                
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        });
}

exports.delete_specific_product = (req, res, next)=>{
    const id = req.params.productId;
    Product.deleteOne({_id: id})
    .exec()
    .then(result =>{
        console.log(result);
        res.status(200).json({
            message: "Product deleted!",
            request :{
                type: 'DELETE'
            }
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    })
}
