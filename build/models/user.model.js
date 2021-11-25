"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const user_roles_1 = require("./types/user-roles");
const bcrypt_1 = __importDefault(require("bcrypt"));
const validRoles = {
    values: Object.values(user_roles_1.UserRoles),
    message: "{VALUE} is not a valid role",
};
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    lastname: {
        type: String,
        required: [true, "Lastname is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        hide: true,
    },
    registerDate: {
        type: String,
        required: [true, "Register date is required"],
    },
    birthday: {
        type: String,
        required: [true, "Birthday is required"],
    },
    role: {
        type: String,
        enum: validRoles,
        default: "CLIENT",
        required: [true, "Role is required"],
    },
    active: {
        type: Boolean,
    },
    stripeCustomer: {
        type: String,
    },
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.password;
            delete ret.__v;
        },
    },
});
userSchema.pre("save", function (done) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified("password")) {
            const salt = yield bcrypt_1.default.genSalt(10);
            const hashed = yield bcrypt_1.default.hash(this.get("password"), salt);
            this.set("password", hashed);
        }
        done();
    });
});
userSchema.methods.comparePassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(password, this.get("password"));
    });
};
userSchema.statics.build = (attrs) => {
    return new User(attrs);
};
const User = (0, mongoose_1.model)("User", userSchema);
exports.User = User;
