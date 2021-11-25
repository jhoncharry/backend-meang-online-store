"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    id: {
        type: String,
        required: [true, "Name is required"],
        unique: true,
    },
    name: {
        type: String,
        required: [true, "Lastname is required"],
        unique: true,
    },
    slug: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    released: {
        type: String,
        required: [true, "Email is required"],
    },
    img: {
        type: String,
        required: [true, "Email is required"],
    },
    clip: {
        type: Object,
    },
    rating: {
        type: Object,
    },
    shortScreenshots: {
        type: Object,
    },
});
const Product = (0, mongoose_1.model)("Product", productSchema);
exports.Product = Product;
