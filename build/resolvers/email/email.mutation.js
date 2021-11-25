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
const bad_request_error_1 = require("../../common/errors/bad-request-error");
const custom_response_1 = require("../../common/response/custom-response");
const email_service_1 = __importDefault(require("../services/email.service"));
const email_mutation = {
    Mutation: {
        sendEmail(_, { mail }) {
            return __awaiter(this, void 0, void 0, function* () {
                const msg = {
                    from: {
                        name: "🕹️ Gamezonia Online Store 🕹️ 👻",
                        address: "jhon.charrysoftware@gmail.com",
                    },
                    to: mail.to,
                    subject: mail.subject,
                    html: mail.html,
                };
                const email = yield email_service_1.default.sendEmail(msg);
                if (!email)
                    throw new bad_request_error_1.BadRequestError("Unable to send e-mail");
                return (0, custom_response_1.customResponse)(true, `Test email has been sent to ${mail.to}`);
            });
        },
        sendUserActivateEmail(_, { email }) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield email_service_1.default.sendUserActivateEmail(email);
            });
        },
        verifyUserActivateEmail(_, __, { req }) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield email_service_1.default.verifyUserActivateEmail(req);
            });
        },
        sendUserResetPasswordEmail(_, { email }) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield email_service_1.default.sendUserResetPasswordEmail(email);
            });
        },
        verifyUserResetPasswordEmail(_, { password }, { req }) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield email_service_1.default.verifyUserResetPasswordEmail(password, req);
            });
        },
    },
};
exports.default = email_mutation;
