"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Genre = void 0;
const mongoose_1 = require("mongoose");
const genreSchema = new mongoose_1.Schema({
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
const Genre = (0, mongoose_1.model)("Genre", genreSchema);
exports.Genre = Genre;
