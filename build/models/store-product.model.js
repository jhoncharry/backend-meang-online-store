"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreProduct = void 0;
const mongoose_1 = require("mongoose");
const storeProductSchema = new mongoose_1.Schema({
    id: {
        type: Number,
        required: [true, "Name is required"],
        unique: true,
    },
    product_id: {
        type: String,
        required: [true, "Name is required"],
        unique: true,
    },
    platform_id: {
        type: String,
        required: [true, "Name is required"],
        unique: true,
    },
    active: {
        type: Boolean,
    },
    price: {
        type: Number,
    },
    stock: {
        type: Number,
    },
});
const StoreProduct = (0, mongoose_1.model)("StoreProduct", storeProductSchema, "products_platforms");
exports.StoreProduct = StoreProduct;
