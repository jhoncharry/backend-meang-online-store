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
const user_model_1 = require("../../models/user.model");
const user_validators_1 = require("../../common/validators/user.validators");
const bad_request_error_1 = require("../../common/errors/bad-request-error");
const internal_server_error_1 = require("../../common/errors/internal-server-error");
const index_validation_1 = require("../../common/validators/index.validation");
const custom_response_1 = require("../../common/response/custom-response");
const pagination_1 = require("../../helpers/pagination");
const email_service_1 = __importDefault(require("./email.service"));
const user_active_1 = require("../../models/types/user-active");
class UserService {
    static register(userInput) {
        return __awaiter(this, void 0, void 0, function* () {
            let value = yield (0, index_validation_1.validationInputs)(user_validators_1.userCreateValidation, userInput);
            value.registerDate = new Date().toISOString();
            const userCheck = yield user_model_1.User.findOne({ email: value.email });
            if (userCheck) {
                throw new bad_request_error_1.BadRequestError("This user already exists");
            }
            value.active = false;
            const user = new user_model_1.User(value);
            const userSaved = yield user.save();
            if (!userSaved) {
                throw new internal_server_error_1.InternalServerError("Couldn't save the data");
            }
            yield email_service_1.default.sendUserActivateEmail(userSaved.email);
            return (0, custom_response_1.customResponse)(true, "User created", { user: userSaved });
        });
    }
    static updateUser(userInput) {
        return __awaiter(this, void 0, void 0, function* () {
            let value = yield (0, index_validation_1.validationInputs)(user_validators_1.userUpdateValidation, userInput);
            const userCheck = yield user_model_1.User.findById(value._id);
            if (!userCheck) {
                throw new bad_request_error_1.BadRequestError("This user doesn't exists");
            }
            userCheck.set(value);
            return yield userCheck
                .save()
                .then((userUpdated) => (0, custom_response_1.customResponse)(true, "User Updated", { user: userUpdated }))
                .catch(() => {
                throw new internal_server_error_1.InternalServerError("Couldn't save the data");
            });
        });
    }
    static deleteUser(userInput) {
        return __awaiter(this, void 0, void 0, function* () {
            let value = yield (0, index_validation_1.validationInputs)(user_validators_1.userDeleteValidation, userInput);
            const userCheck = yield user_model_1.User.findById(value._id);
            if (!userCheck) {
                throw new bad_request_error_1.BadRequestError("This user doesn't exists");
            }
            return yield userCheck
                .remove()
                .then((userDeleted) => (0, custom_response_1.customResponse)(true, "User Deleted", { user: userDeleted }))
                .catch(() => {
                throw new internal_server_error_1.InternalServerError("Couldn't save the data");
            });
        });
    }
    static unblockUser(userInput) {
        return __awaiter(this, void 0, void 0, function* () {
            let value = yield (0, index_validation_1.validationInputs)(user_validators_1.userUnblockValidation, userInput);
            const userCheck = yield user_model_1.User.findById(value._id);
            if (!userCheck) {
                throw new bad_request_error_1.BadRequestError("This user id doesn't exists");
            }
            userCheck.set({ active: value.unblock });
            const action = value.unblock ? "Unblocked" : "Blocked";
            return yield userCheck
                .save()
                .then((user) => {
                return (0, custom_response_1.customResponse)(true, `User ${action}`, { user });
            })
                .catch(() => {
                throw new internal_server_error_1.InternalServerError("Couldn't block the user");
            });
        });
    }
    static getUsers(paginationOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = paginationOptions.page || 1;
            const itemsPage = paginationOptions.itemsPage || 20;
            const active = paginationOptions.active || user_active_1.ActiveValues.ACTIVE;
            let activeFilter = {};
            if (active === user_active_1.ActiveValues.ACTIVE) {
                activeFilter = { active: { $ne: false } };
            }
            if (active === user_active_1.ActiveValues.INACTIVE) {
                activeFilter = { active: false };
            }
            try {
                const paginationData = yield (0, pagination_1.pagination)(page, itemsPage, user_model_1.User, activeFilter);
                if (page > paginationData.pages) {
                    throw new bad_request_error_1.BadRequestError("No data result");
                }
                return (0, custom_response_1.customResponse)(true, "User list", {
                    users: yield user_model_1.User.find(activeFilter)
                        .skip(paginationData.skip)
                        .limit(paginationData.itemsPage)
                        .exec(),
                    info: {
                        page: paginationData.page,
                        pages: paginationData.pages,
                        itemsPage: paginationData.itemsPage,
                        total: paginationData.total,
                    },
                });
            }
            catch (error) {
                if (error instanceof bad_request_error_1.BadRequestError)
                    return error;
                throw new internal_server_error_1.InternalServerError("Something went wrong...");
            }
        });
    }
    static getUser(userInput) {
        return __awaiter(this, void 0, void 0, function* () {
            let value = yield (0, index_validation_1.validationInputs)(user_validators_1.userGetByIdValidation, userInput);
            const existingUser = yield user_model_1.User.findOne({ _id: value._id });
            if (!existingUser) {
                throw new bad_request_error_1.BadRequestError("User Doesn't exist");
            }
            return (0, custom_response_1.customResponse)(true, "User by ID", {
                user: existingUser,
            });
        });
    }
    static changePassword(userInput) {
        return __awaiter(this, void 0, void 0, function* () {
            let value = yield (0, index_validation_1.validationInputs)(user_validators_1.userChangePasswordValidation, userInput);
            const userCheck = yield user_model_1.User.findById(value._id);
            if (!userCheck) {
                throw new bad_request_error_1.BadRequestError("This user doesn't exists");
            }
            userCheck.set(value);
            return yield userCheck
                .save()
                .then((userUpdated) => (0, custom_response_1.customResponse)(true, "Change user password Successfully", {
                user: userUpdated,
            }))
                .catch(() => {
                throw new internal_server_error_1.InternalServerError("Couldn't save the data");
            });
        });
    }
}
exports.default = UserService;
