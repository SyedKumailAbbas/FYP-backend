const Products = require('../models/Product');

// Get all products
const getProducts = async (req, res) => {
    try {
        const products = await Products.find();
        res.status(200).json({ success: true, data: products });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single product by ID
const getSingleProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Products.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ success: true, data: product });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a new product
const createProduct = async (req, res) => {
    try {
        const newProduct = new Products(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json({ success: true, data: savedProduct });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete a product by ID
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Products.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params; // Extract product ID from the request parameters
        const updates = req.body; // The fields to update from the request body

        // Find the product by ID and update its details
        const updatedProduct = await Products.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.status(200).json({ success: true, data: updatedProduct });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
const filterProducts = async (req, res) => {
    try {
        const { minPrice, maxPrice, brand, category, specifications } = req.query;

        // Build the filter object dynamically
        let filter = {};

        // Filter by price range
        if (minPrice || maxPrice) {
            filter.prices = {};
            if (minPrice) filter.prices.$gte = parseFloat(minPrice);
            if (maxPrice) filter.prices.$lte = parseFloat(maxPrice);
        }

        // Filter by brand
        if (brand) {
            filter.brand = brand;
        }

        // Filter by category
        if (category) {
            filter.category = category;
        }

        // Filter by specifications (Map type)
        if (specifications) {
            try {
                // Parse the specifications string into an object
                const specFilters = JSON.parse(specifications);

                // Iterate over the parsed object and apply it to the filter
                Object.entries(specFilters).forEach(([key, value]) => {
                    if (key && value) {
                        // Query the Map field in MongoDB with the key-value pair
                        filter[`specifications.${key}`] = value; 
                    }
                });
            } catch (err) {
                return res.status(400).json({ success: false, message: 'Invalid specifications format' });
            }
        }

        // Query the database with the filter object
        const products = await Products.find(filter);

        // Check if products were found
        if (!products.length) {
            return res.status(404).json({ success: false, message: 'No products found' });
        }

        res.status(200).json({ success: true, data: products });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};



module.exports = {
    getProducts,
    getSingleProduct,
    createProduct,
    deleteProduct,
    updateProduct,
    filterProducts
};
