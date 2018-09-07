const express   = require('express');
const router    = express.Router();

// Handle incoming Get Request to /orders
router.get('/',(req, res, next) => {
    res.status(200).json({
        message: 'Orders where fetched'
    });
});

router.post('/',(req, res, next) => {
    const order = {
        productId : req.body.productId,
        quantity : req.body.quantity
    }
    res.status(201).json({
        order : order
    });
});

router.get('/:orderId',(req, res, next) => {

    res.status(200).json({
        message: 'Order details'
    });
});

router.delete('/:orderId',(req, res, next) => {

    res.status(200).json({
        message: 'Order deleted',
        orderId : req.params.orderId
    });
});

module.exports  = router;