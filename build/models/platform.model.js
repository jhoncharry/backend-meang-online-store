"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Platform = void 0;
const mongoose_1 = require("mongoose");
const platformSchema = new mongoose_1.Schema({
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
    active: {
        type: Boolean,
    },
});
const Platform = (0, mongoose_1.model)("Platform", platformSchema);
exports.Platform = Platform;
