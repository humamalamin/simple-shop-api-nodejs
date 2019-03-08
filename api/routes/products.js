const express   = require('express');
const router    = express.Router();
const checkAuth =  require('../middleware/check-auth');
const multer    = require('multer');

const storage   = multer.diskStorage({
    destination: function(req,file, cb){
        cb(null, './uploads/');
    },
    filename: function(req,file, cb){
        cb(null, new Date().toISOString() + file.originalname)
    }
})

const fileFilter    = (req, file, cb) => {
    //reject file
    if(file.mimetype == 'image/jpeg'|| file.mimetype == 'image/png'){
        cb(null, true);   
    }else{
        cb(new Error("Type Image foul."), false);
    }
};

const upload    = multer({storage: storage, 
    limit: {
        fileSize:1024 * 1024 * 2
    },
    fileFilter: fileFilter
})

const ProductsController = require('../controllers/products');

router.get('/', checkAuth, ProductsController.products_get_all);

router.post('/', checkAuth ,upload.single('productImage'), ProductsController.products_post);

router.get('/:productId', checkAuth, ProductsController.products_detail);

router.patch('/:productId', checkAuth, ProductsController.products_update);

router.delete('/:productId', checkAuth, ProductsController.products_delete);

module.exports  = router;