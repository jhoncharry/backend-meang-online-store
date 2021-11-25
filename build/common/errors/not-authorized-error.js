"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotAuthorizedError = void 0;
const apollo_server_errors_1 = require("apollo-server-errors");
class NotAuthorizedError extends apollo_server_errors_1.ApolloError {
    constructor() {
        super("Not Authorized", "NOT_AUTHORIZED_ERROR");
        Object.defineProperty(this, "name", { value: "NotAuthorizedError" });
    }
}
exports.NotAuthorizedError = NotAuthorizedError;
