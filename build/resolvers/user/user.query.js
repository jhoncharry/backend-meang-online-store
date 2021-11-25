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
const user_service_1 = __importDefault(require("../services/user.service"));
const auth_service_1 = __importDefault(require("../services/auth.service"));
const user_query = {
    Query: {
        users(_, paginationOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield user_service_1.default.getUsers(paginationOptions);
            });
        },
        user(_, userInput) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield user_service_1.default.getUser(userInput);
            });
        },
        login(_, args, { req }) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield auth_service_1.default.login(args, { req });
            });
        },
        loginRestricted(_, args, { req }) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield auth_service_1.default.loginRestricted(args, { req });
            });
        },
        logout(_, __, { req }) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield auth_service_1.default.logout({ req });
            });
        },
        renewToken(_, __, context) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield auth_service_1.default.renewToken(context);
            });
        },
        me(_, __, { currentUser }) {
            return __awaiter(this, void 0, void 0, function* () {
                return auth_service_1.default.me({ currentUser });
            });
        },
    },
};
exports.default = user_query;
