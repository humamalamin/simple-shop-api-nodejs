const express   = require('express');
const app       = express();
const morgan    = require('morgan');
const bodyParser= require('body-parser');
const mongoose  = require('mongoose');

const productRoutes = require('./api/routes/products');
const ordersRoutes  = require('./api/routes/orders');

mongoose.connect(
    'mongodb://admin:'
    +process.env.MONGO_ATLAS_PW+
    '@nodejs-shard-00-00-akyfi.mongodb.net:27017,nodejs-shard-00-01-akyfi.mongodb.net:27017,nodejs-shard-00-02-akyfi.mongodb.net:27017/test?ssl=true&replicaSet=NodeJS-shard-0&authSource=admin&retryWrites=true',
    {
        useNewUrlParser:true
    });

mongoose.Promise    = global.Promise;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if(req.method === 'OPTIONS')
    {
        res.header('Access-Control-Allow-Methods','PUT, POST, DELETE, PATCH, GET');
        returnres.status(200).json({
        });
    }
    next();
});

// Routes which should handle requests
app.use('/products',productRoutes);
app.use('/orders',ordersRoutes);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error : {
            message : error.message
        }
    });
});

module.exports = app;