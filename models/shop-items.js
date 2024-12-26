"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Items = void 0;
const mongoose_1 = require("mongoose");
const newSchema = new mongoose_1.Schema({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    leftItems: {
        type: Number,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
});
exports.Items = (0, mongoose_1.model)("items", newSchema);
