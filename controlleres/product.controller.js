const Products = require('../models/Product')

const getProducts = async (req, res) => {
    try {
        const products = await Products.find()
        res.status(200).json({ success: true, data: products })

    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
}


const getSingleProduct = async (req, res) => {
    try {
        const { id } = req.params
        const product = await Products.findById(id)
        if(!product){
            return res.status(404).json({message: "product not found"})
        }
        res.status(200).json({success:true, data:product})

    }

    catch (err) {
        res.status(500).json({ message: err.message })
    }
}

module.exports= {getProducts, getSingleProduct}