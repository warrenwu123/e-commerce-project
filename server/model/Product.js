const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    image: String,
    title: String,
    description: String,
    category: String,
    types: String,
    size: String,
    colour: String,
    price: Number,
    salePrice: Number,
    totalStock: Number,
    averageReview: Number,
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);