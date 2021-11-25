"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = void 0;
const apollo_server_errors_1 = require("apollo-server-errors");
class NotFoundError extends apollo_server_errors_1.ApolloError {
    constructor(message) {
        super(message, "NOT_FOUND_ERROR");
        Object.defineProperty(this, "name", { value: "NotFoundError" });
    }
}
exports.NotFoundError = NotFoundError;
