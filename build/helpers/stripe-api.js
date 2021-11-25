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
exports.STRIPE_ACTIONS = exports.STRIPE_OBJECTS = void 0;
exports.STRIPE_OBJECTS = {
    CUSTOMERS: "customers",
    TOKENS: "tokens",
    CHARGES: "charges",
};
exports.STRIPE_ACTIONS = {
    CREATE: "create",
    UPDATE: "update",
    DELETE: "del",
    GET: "retrieve",
    LIST: "list",
    CREATE_SOURCE: "createSource",
    UPDATE_SOURCE: "updateSource",
    DELETE_SOURCE: "deleteSource",
    GET_SOURCE: "retrieveSource",
    GET_SOURCES: "listSources",
};
class StripeApi {
    constructor() {
        this.stripe = require("stripe")(process.env.STRIPE_API_KEY, {
            apiVersion: process.env.STRIPE_API_VERSION,
        });
    }
    execute(object, action, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.stripe[object][action](...args);
        });
    }
}
exports.default = StripeApi;
