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
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = require("../../models/user.model");
const jwt_1 = require("../../helpers/jwt");
const bad_request_error_1 = require("../../common/errors/bad-request-error");
const not_authorized_error_1 = require("../../common/errors/not-authorized-error");
const custom_response_1 = require("../../common/response/custom-response");
class AuthService {
    static login(args, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = args;
            const { req } = context;
            const existingUser = yield user_model_1.User.findOne({ email }).select("-registerDate -birthday");
            if (!existingUser) {
                throw new bad_request_error_1.BadRequestError("Invalid credentials");
            }
            const passwordsMatch = yield existingUser.comparePassword(password);
            if (!passwordsMatch) {
                throw new bad_request_error_1.BadRequestError("Invalid credentials");
            }
            if (existingUser.active !== true) {
                throw new bad_request_error_1.BadRequestError("This user hasn't been activated");
            }
            const token = yield jwt_1.JWT.sign({ user: existingUser });
            req.session = {
                jwt: token,
            };
            return (0, custom_response_1.customResponse)(true, "User logged", { user: existingUser });
        });
    }
    static loginRestricted(args, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = args;
            const { req } = context;
            const existingUser = yield user_model_1.User.findOne({ email }).select("-registerDate -birthday");
            if (!existingUser) {
                throw new bad_request_error_1.BadRequestError("Invalid credentials");
            }
            if (existingUser.active !== true) {
                throw new bad_request_error_1.BadRequestError("This user hasn't been activated");
            }
            if (!existingUser.role.includes("ADMIN")) {
                throw new bad_request_error_1.BadRequestError("You can't access this page");
            }
            const passwordsMatch = yield existingUser.comparePassword(password);
            if (!passwordsMatch) {
                throw new bad_request_error_1.BadRequestError("Invalid credentials");
            }
            const token = yield jwt_1.JWT.sign({ user: existingUser });
            req.session = {
                jwt: token,
            };
            return (0, custom_response_1.customResponse)(true, "User logged", { user: existingUser });
        });
    }
    static logout(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const { req } = context;
            if (!req.session.jwt)
                throw new bad_request_error_1.BadRequestError("Unable to logout");
            req.session = null;
            return { status: true, message: "logout" };
        });
    }
    static renewToken(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const { currentUser, req } = context;
            if (!currentUser)
                throw new not_authorized_error_1.NotAuthorizedError();
            const token = yield jwt_1.JWT.sign({ user: currentUser });
            req.session = {
                jwt: token,
            };
            return (0, custom_response_1.customResponse)(true, "New token was generated", {
                user: currentUser,
            });
        });
    }
    static me(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const { currentUser } = context;
            if (!currentUser)
                throw new not_authorized_error_1.NotAuthorizedError();
            return (0, custom_response_1.customResponse)(true, "Authenticated user", { user: currentUser });
        });
    }
}
exports.default = AuthService;
