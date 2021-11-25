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
const not_authorized_error_1 = require("../../common/errors/not-authorized-error");
const custom_response_1 = require("../../common/response/custom-response");
const mailer_1 = require("../../config/mailer");
const jwt_1 = require("../../helpers/jwt");
const user_model_1 = require("../../models/user.model");
const user_service_1 = __importDefault(require("./user.service"));
class EmailService {
    static sendEmail(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                mailer_1.transport.sendMail(msg, (error, info) => {
                    error ? reject(false) : resolve(true);
                });
            });
        });
    }
    static sendUserActivateEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const checkUser = yield user_model_1.User.findOne({ email });
            if (!checkUser) {
                throw new bad_request_error_1.BadRequestError("This email doesn't exists");
            }
            if (checkUser.active === true) {
                throw new bad_request_error_1.BadRequestError("This user is already activated");
            }
            const token = yield jwt_1.JWT.sign({ user: { _id: checkUser._id, email } });
            const html = `to activate your account click on the following button <a href="${process.env.CLIENT_URL}/#/active/${token}">Click here</a>`;
            const msg = {
                from: {
                    name: "🕹️ Gamezonia Online Store 🕹️ 👻",
                    address: "jhon.charrysoftware@gmail.com",
                },
                to: email,
                subject: "User activation",
                html,
            };
            const checkEmail = yield this.sendEmail(msg);
            if (!checkEmail)
                throw new bad_request_error_1.BadRequestError("Unable to send e-mail");
            return (0, custom_response_1.customResponse)(true, `Email for user activation has been sent to ${email}`);
        });
    }
    static verifyUserActivateEmail(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req ? req.headers.authorization : null;
            const currentUserToActiveAccount = jwt_1.JWT.verify(token);
            if (!currentUserToActiveAccount)
                throw new not_authorized_error_1.NotAuthorizedError();
            const { _id, email } = currentUserToActiveAccount;
            const checkUser = yield user_model_1.User.findById(_id);
            if (!checkUser) {
                throw new bad_request_error_1.BadRequestError("This user doesn't exists");
            }
            if (checkUser.active === true) {
                throw new bad_request_error_1.BadRequestError("This user is already activated");
            }
            yield user_service_1.default.unblockUser({ _id, unblock: true });
            const html = "<b>Successful user activation, now you can log in.</b>";
            const msg = {
                from: {
                    name: "🕹️ Gamezonia Online Store 🕹️ 👻",
                    address: "jhon.charrysoftware@gmail.com",
                },
                to: email,
                subject: "User activation successful",
                html,
            };
            const checkEmail = yield this.sendEmail(msg);
            if (!checkEmail)
                throw new bad_request_error_1.BadRequestError("Unable to send e-mail");
            return (0, custom_response_1.customResponse)(true, `Email on succesful user activation has been sent to ${email}`);
        });
    }
    static sendUserResetPasswordEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const checkUser = yield user_model_1.User.findOne({ email });
            if (!checkUser) {
                throw new bad_request_error_1.BadRequestError("This email doesn't exists");
            }
            const token = yield jwt_1.JWT.sign({ user: { _id: checkUser._id, email } });
            const html = `to reset your password click on the following button <a href="${process.env.CLIENT_URL}/#/reset/${token}">Click here</a>`;
            const msg = {
                from: {
                    name: "🕹️ Gamezonia Online Store 🕹️ 👻",
                    address: "jhon.charrysoftware@gmail.com",
                },
                to: email,
                subject: "Reset user password",
                html,
            };
            const checkEmail = yield this.sendEmail(msg);
            if (!checkEmail)
                throw new bad_request_error_1.BadRequestError("Unable to send e-mail");
            return (0, custom_response_1.customResponse)(true, `Email for reset user password has been sent to ${email}`);
        });
    }
    static verifyUserResetPasswordEmail(password, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req ? req.headers.authorization : null;
            const currentUserToResetPassword = jwt_1.JWT.verify(token);
            if (!currentUserToResetPassword)
                throw new not_authorized_error_1.NotAuthorizedError();
            const { _id, email } = currentUserToResetPassword;
            const checkUser = yield user_model_1.User.findById(_id);
            if (!checkUser) {
                throw new bad_request_error_1.BadRequestError("This user doesn't exists");
            }
            yield user_service_1.default.changePassword({ _id, password });
            const html = "<b>Successful reset user password, now you can log in.</b>";
            const msg = {
                from: {
                    name: "🕹️ Gamezonia Online Store 🕹️ 👻",
                    address: "jhon.charrysoftware@gmail.com",
                },
                to: email,
                subject: "Reset user password Successfully",
                html,
            };
            const checkEmail = yield this.sendEmail(msg);
            if (!checkEmail)
                throw new bad_request_error_1.BadRequestError("Unable to send e-mail");
            return (0, custom_response_1.customResponse)(true, `Email on succesful reset user password has been sent to ${email}`);
        });
    }
}
exports.default = EmailService;
