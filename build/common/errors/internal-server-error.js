"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = void 0;
const apollo_server_errors_1 = require("apollo-server-errors");
class InternalServerError extends apollo_server_errors_1.ApolloError {
    constructor(message) {
        super(message, "INTERNAL_SERVER_ERROR");
        Object.defineProperty(this, "name", { value: "InternalServerError" });
    }
}
exports.InternalServerError = InternalServerError;
