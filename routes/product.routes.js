const {getProducts, getSingleProduct} = require('../controlleres/product.controller')
const express = require('express')

const router = express.Router()

router.route('/getall').get(getProducts)
router.route('getsingle/:id').get(getSingleProduct)


module.exports=router