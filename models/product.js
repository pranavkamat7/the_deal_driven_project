const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: [
    "electronics",
    "mobiles",
    "computers",
    "home-kitchen",
    "fashion",
    "mens-clothing",
    "womens-clothing",
    "footwear",
    "beauty",
    "health",
    "grocery",
    "books",
    "stationery",
    "toys",
    "sports",
    "automotive",
    "furniture",
    "home-improvement",
    "jewellery",
    "watches",
    "bags",
    "pets",
    "media",
    "garden",
    "industrial",
    "others"
  ]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Product", productSchema);
