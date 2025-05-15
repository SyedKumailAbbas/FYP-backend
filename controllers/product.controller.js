const Products = require('../models/Product');
const mongoose = require('mongoose');

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

        // Step 1: Get product by ID
        const product = await Products.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Step 2: Use the product's name to search in predictive_price
        const predictivePriceCollection = mongoose.connection.collection('predictive_price');
        const predictivePriceData = await predictivePriceCollection.findOne({ title: product.name });

        // Step 3: Return both product and predictive price data
        res.status(200).json({
            success: true,
            data: {
                product,
                predictive_price: predictivePriceData || null
            }
        });

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
        let { minPrice, maxPrice, brand, category, specifications } = req.query;

        // Lowercase string inputs for case-insensitive filtering
        if (brand) {
            brand = brand.toLowerCase();
        }
        if (category) {
            category = category.toLowerCase();
        }
        if (specifications) {
            try {
                // Parse specifications JSON
                const specFilters = JSON.parse(specifications);

                // Convert spec filter values to lowercase
                Object.keys(specFilters).forEach(key => {
                    if (specFilters[key] && typeof specFilters[key] === 'string') {
                        specFilters[key] = specFilters[key].toLowerCase();
                    }
                });

                // Reassign lowercased specs back to specifications
                specifications = JSON.stringify(specFilters);
            } catch (err) {
                return res.status(400).json({ success: false, message: 'Invalid specifications format' });
            }
        }

        // Build the filter object dynamically
        let filter = {};

        // Filter by price range
        if (minPrice || maxPrice) {
            filter.prices = {};
            if (minPrice) filter.prices.$gte = parseFloat(minPrice);
            if (maxPrice) filter.prices.$lte = parseFloat(maxPrice);
        }

        // For text fields, use case-insensitive regex match
        if (brand) {
            filter.brand = { $regex: new RegExp(`^${brand}$`, 'i') };
        }

        if (category) {
            filter.category = { $regex: new RegExp(`^${category}$`, 'i') };
        }

        // Filter by specifications (case-insensitive)
        if (specifications) {
            try {
                const specFilters = JSON.parse(specifications);

                Object.entries(specFilters).forEach(([key, value]) => {
                    if (key && value) {
                        const dbKey = `specifications.${key.charAt(0).toUpperCase() + key.slice(1)}`;

                        // Use regex for case-insensitive matching on specs
                        filter[dbKey] = { $regex: new RegExp(`^${value}$`, 'i') };
                    }
                });
            } catch (err) {
                return res.status(400).json({ success: false, message: 'Invalid specifications format' });
            }
        }

        // Query the database with the filter object
        const products = await Products.find(filter);

        if (!products.length) {
            return res.status(404).json({ success: false, message: 'No products found' });
        }

        res.status(200).json({ success: true, data: products });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};



// Search products by name or product (partial, case-insensitive)
const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ success: false, message: 'Search query is required' });
    }

    // Use a regex for case-insensitive partial matching on the 'name' field
    const regex = new RegExp(query, 'i');

    // Find products where 'name' matches the regex
    const products = await Products.find({
      name: { $regex: regex }
    });

    if (!products.length) {
      return res.status(404).json({ success: false, message: 'No products found matching your search' });
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
    filterProducts,
    searchProducts
};
