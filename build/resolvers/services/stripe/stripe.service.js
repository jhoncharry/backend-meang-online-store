"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const stripe_api_1 = __importStar(require("../../../helpers/stripe-api"));
const custom_response_1 = require("../../../common/response/custom-response");
const internal_server_error_1 = require("../../../common/errors/internal-server-error");
const bad_request_error_1 = require("../../../common/errors/bad-request-error");
const user_model_1 = require("../../../models/user.model");
class StripeService extends stripe_api_1.default {
    getCustomers(limit, startingAfter, endingBefore) {
        return __awaiter(this, void 0, void 0, function* () {
            let pagination;
            if (startingAfter !== "" && endingBefore === "") {
                pagination = { starting_after: startingAfter };
            }
            else if (startingAfter === "" && endingBefore !== "") {
                pagination = { ending_before: endingBefore };
            }
            else {
                pagination = {};
            }
            return yield this.execute(stripe_api_1.STRIPE_OBJECTS.CUSTOMERS, stripe_api_1.STRIPE_ACTIONS.LIST, Object.assign({ limit }, pagination))
                .then((result) => {
                return (0, custom_response_1.customResponse)(true, "Lista cargada successfully", {
                    hasMore: result.has_more,
                    customers: result.data,
                });
            })
                .catch(() => {
                throw new internal_server_error_1.InternalServerError("Couldn't get the list");
            });
        });
    }
    getCustomer(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.execute(stripe_api_1.STRIPE_OBJECTS.CUSTOMERS, stripe_api_1.STRIPE_ACTIONS.GET, id)
                .then((result) => {
                return (0, custom_response_1.customResponse)(true, `Customer information ${result.name}  loaded successfully`, {
                    customer: result,
                });
            })
                .catch((e) => {
                console.log(e);
                throw new internal_server_error_1.InternalServerError("Couldn't get the client");
            });
        });
    }
    createCustomer(name, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const userExisting = yield this.execute(stripe_api_1.STRIPE_OBJECTS.CUSTOMERS, stripe_api_1.STRIPE_ACTIONS.LIST, {
                email,
            });
            if (userExisting.data.length > 0) {
                throw new bad_request_error_1.BadRequestError("This user already exists");
            }
            return yield this.execute(stripe_api_1.STRIPE_OBJECTS.CUSTOMERS, stripe_api_1.STRIPE_ACTIONS.CREATE, {
                name,
                email,
                description: `${name} (${email})`,
            })
                .then((result) => __awaiter(this, void 0, void 0, function* () {
                const userCheck = yield user_model_1.User.findOne({ email });
                if (!userCheck) {
                    throw new bad_request_error_1.BadRequestError("This user doesn't exists");
                }
                userCheck.set({ stripeCustomer: result.id });
                yield userCheck.save();
                return (0, custom_response_1.customResponse)(true, `${name} client has been created`, {
                    customer: result,
                });
            }))
                .catch(() => {
                throw new internal_server_error_1.InternalServerError("Couldn't create client");
            });
        });
    }
    updateCustomer(id, customer) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.execute(stripe_api_1.STRIPE_OBJECTS.CUSTOMERS, stripe_api_1.STRIPE_ACTIONS.UPDATE, id, customer)
                .then((result) => {
                return (0, custom_response_1.customResponse)(true, `User ${id} updated`, {
                    customer: result,
                });
            })
                .catch(() => {
                throw new internal_server_error_1.InternalServerError("Couldn't create client");
            });
        });
    }
    deleteCustomer(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.execute(stripe_api_1.STRIPE_OBJECTS.CUSTOMERS, stripe_api_1.STRIPE_ACTIONS.DELETE, id)
                .then((result) => __awaiter(this, void 0, void 0, function* () {
                if (result.deleted) {
                    yield user_model_1.User.updateOne({ stripeCustomer: result.id }, { $unset: { stripeCustomer: 1 } });
                    return (0, custom_response_1.customResponse)(true, `User ${id} deleted`, {
                        customer: result,
                    });
                }
                throw new bad_request_error_1.BadRequestError("Couldn't update user");
            }))
                .catch(() => {
                throw new internal_server_error_1.InternalServerError("Couldn't delete client");
            });
        });
    }
}
exports.default = StripeService;
