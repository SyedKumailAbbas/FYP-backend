const express = require("express");
const router = express.Router();
const { 
    getProducts, 
    getSingleProduct, 
    createProduct, 
    deleteProduct ,
    updateProduct,
    filterProducts,
    searchProducts
} = require("../controllers/product.controller");

// Routes
router.route("/products").get(getProducts).post(createProduct); // Get all & Create product
router.route("/products/:id").get(getSingleProduct).delete(deleteProduct); // Get single & Delete product
router.put('/products/:id', updateProduct); 
router.get('/filterproduct/filter', filterProducts);
router.get('/search',searchProducts)
module.exports = router;
