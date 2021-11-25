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
const apollo_server_express_1 = require("apollo-server-express");
const user_model_1 = require("../models/user.model");
const jwt_1 = require("./jwt");
const pubsub = new apollo_server_express_1.PubSub();
const contextModel = ({ req, connection }) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req ? req.session.jwt : connection.authorization;
    const currentUser = jwt_1.JWT.verify(token);
    return {
        req,
        pubsub,
        currentUser: yield getCurrentUser(currentUser),
    };
});
const getCurrentUser = (currentUser) => __awaiter(void 0, void 0, void 0, function* () {
    if (currentUser) {
        return yield user_model_1.User.findById(currentUser._id)
            .select("-registerDate -birthday")
            .then((currentUser) => currentUser)
            .catch(() => null);
    }
});
exports.default = contextModel;
