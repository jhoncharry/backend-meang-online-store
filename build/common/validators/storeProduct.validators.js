"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeProductGetByIdValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const id = joi_1.default.number();
exports.storeProductGetByIdValidation = joi_1.default.object().keys({
    id: id.required(),
});
