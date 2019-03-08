const mongoose  = require('mongoose');
const Product   = require('../models/product');

exports.products_get_all = (req, res, next) => {
    Product.find()
    .select('name price _id productImage')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    productImage: doc.productImage,
                    _id: doc._id,
                    request: {
                        type: "GET",
                        url: 'http://localhost:3000/products/'+doc._id
                    }
                }
            })
        };
        res.status(200).json(response);
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error:err});
    });
}

exports.products_post = (req, res, next) => {
    const product   = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product.save()
    .then(result => {

        res.status(201).json({
            message:"Created product success",
            createdProduct: {
                name: result.name,
                price: result.price,
                productImage: result.productImage,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/'+result._id
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        });
    });
}

exports.products_detail = (req, res, next) => {
    const id    = req.params.productId;
    Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then(doc => {
        console.log(doc);
        if(doc)
        {
            res.status(200).json({
                product: doc,
                request:{
                    type: 'GET',
                    url: 'http://localhost:3000/products'
                }
            });
        }else{
            res.status(404).json({message: "No valid entry found"});
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error:err});
    });
}

exports.products_update = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};

    for(const ops of req.body)
    {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id:id},{ $set: updateOps})
    .exec()
    .then( result => {
        res.status(200).json({
            message: 'Product Updated!',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/products/'+id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        });
    });
}

exports.products_delete = (req, res, next) => {
    const id = req.params.productId;
    Product.remove({_id:id}).exec()
    .then(result => {
        res.status(200).json({
            message: 'Product Deleted',
            request:{
                type: 'GET',
                url: 'http://localhost:3000/products',
                body: {name: 'String', price: 'Number'}
            }
        });
    })
    .catch(err => {
        res.status(500).json({error:err});
    });
}