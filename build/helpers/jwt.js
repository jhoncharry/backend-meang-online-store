"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const internal_server_error_1 = require("../common/errors/internal-server-error");
class JWT {
    static sign(data) {
        return new Promise((resolve, reject) => {
            jsonwebtoken_1.default.sign({ user: data.user }, this.secretKey, {
                expiresIn: "1h",
            }, (error, token) => {
                if (error) {
                    reject(new internal_server_error_1.InternalServerError("Failed to generate access token"));
                }
                else {
                    resolve(token);
                }
            });
        });
    }
    static verify(token) {
        try {
            const { user } = jsonwebtoken_1.default.verify(token, this.secretKey);
            return user;
        }
        catch (error) {
            return null;
        }
    }
}
exports.JWT = JWT;
JWT.secretKey = process.env.TOKEN_SECRET;
