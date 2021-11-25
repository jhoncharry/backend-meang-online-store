"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customResponse = void 0;
function customResponse(status, message, data) {
    return Object.assign({ status,
        message }, data);
}
exports.customResponse = customResponse;
