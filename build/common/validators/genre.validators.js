"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genreUnblockValidation = exports.genreGetByIdValidation = exports.genreDeleteValidation = exports.genreUpdateValidation = exports.genreCreateValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const id = joi_1.default.number();
const name = joi_1.default.string().min(3).max(38);
const unblock = joi_1.default.boolean();
exports.genreCreateValidation = joi_1.default.object().keys({
    name: name.required(),
});
exports.genreUpdateValidation = joi_1.default.object().keys({
    id: id.required(),
    name,
});
exports.genreDeleteValidation = joi_1.default.object().keys({
    id: id.required(),
});
exports.genreGetByIdValidation = joi_1.default.object().keys({
    id: id.required(),
});
exports.genreUnblockValidation = joi_1.default.object().keys({
    id: id.required(),
    unblock: unblock.required(),
});
