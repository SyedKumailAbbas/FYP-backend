
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String, // Product name
      required: true,
      trim: true,
    },
    category: {
      type: String, // Product category
      required: true,
    },
    brand: {
      type: String, // Optional: Brand of the product
      default: null,
    },
    prices: {
      type: [Number], // Array of prices
      default: [],
    },
    urls: [
      {
        websiteName: {
          type: String, // Name of the website
          required: true,
        },
        url: {
          type: String, // URL of the product on the website
          required: true,
        },
        lastUpdated: {
          type: Date, // Timestamp for when the URL was last validated/scraped
          default: Date.now,
        },
      },
    ],
    images: {
      type: [String], // Array of image URLs
      default: [],
    },
    description: {
      type: String, // Text description of the product
      default: "",
    },
    specifications: {
      type: Map, // Key-value pair object for product specifications
      of: String,
      default: {},
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
