"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.platformGetByMultipleIdsValidation = exports.platformGetByIdValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const id = joi_1.default.number();
exports.platformGetByIdValidation = joi_1.default.object().keys({
    id: id.required(),
});
exports.platformGetByMultipleIdsValidation = joi_1.default.object().keys({
    id: joi_1.default.array().min(1).items(joi_1.default.number()).required(),
});
