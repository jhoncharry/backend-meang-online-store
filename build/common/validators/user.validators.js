"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userChangePasswordValidation = exports.userUnblockValidation = exports.userGetByIdValidation = exports.userDeleteValidation = exports.userUpdateValidation = exports.userCreateValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const user_roles_1 = require("../../models/types/user-roles");
const mongoose_1 = __importDefault(require("mongoose"));
const _id = joi_1.default.string().custom((value, helper) => {
    if (!mongoose_1.default.isValidObjectId(value)) {
        return helper.message({ custom: "_id must be Object Id" });
    }
    return value;
});
const name = joi_1.default.string().min(3).max(38);
const lastname = joi_1.default.string().min(3).max(38);
const email = joi_1.default.string().email();
const password = joi_1.default.string().alphanum().min(3).max(38);
const birthday = joi_1.default.string();
const role = joi_1.default.string()
    .valid(...Object.values(user_roles_1.UserRoles))
    .messages({ "any.only": "Must be a valid role" });
const unblock = joi_1.default.boolean();
exports.userCreateValidation = joi_1.default.object().keys({
    name: name.required(),
    lastname: lastname.required(),
    email: email.required(),
    password: password.required(),
    birthday,
    role,
});
exports.userUpdateValidation = joi_1.default.object().keys({
    _id: _id.required(),
    name,
    lastname,
    email,
    password,
    birthday,
    role,
});
exports.userDeleteValidation = joi_1.default.object().keys({
    _id: _id.required(),
});
exports.userGetByIdValidation = joi_1.default.object().keys({
    _id: _id.required(),
});
exports.userUnblockValidation = joi_1.default.object().keys({
    _id: _id.required(),
    unblock: unblock.required(),
});
exports.userChangePasswordValidation = joi_1.default.object().keys({
    _id: _id.required(),
    password: password.required(),
});
