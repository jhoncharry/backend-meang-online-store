"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestError = void 0;
const apollo_server_errors_1 = require("apollo-server-errors");
class BadRequestError extends apollo_server_errors_1.ApolloError {
    constructor(message) {
        super(message, "BAD_REQUEST_ERROR");
        Object.defineProperty(this, "name", { value: "BadRequestError" });
    }
}
exports.BadRequestError = BadRequestError;
