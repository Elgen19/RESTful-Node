const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth')
const multer = require('multer');
const storages = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
    }
})
const upload = multer({storage: storages})
const productController = require('../controllers/productsController')



router.get('/', productController.get_all_products );

router.post('/',  checkAuth,  upload.single('productImage'), productController.create_product );

router.get('/:productId', productController.get_individual_products);

router.patch('/:productId', checkAuth, productController.update_product_information);

router.delete('/:productId', checkAuth, productController.delete_specific_product);



module.exports = router;