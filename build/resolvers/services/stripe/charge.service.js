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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stripe_api_1 = __importStar(require("../../../helpers/stripe-api"));
const custom_response_1 = require("../../../common/response/custom-response");
const internal_server_error_1 = require("../../../common/errors/internal-server-error");
const stripe_service_1 = __importDefault(require("./stripe.service"));
const bad_request_error_1 = require("../../../common/errors/bad-request-error");
const card_service_1 = __importDefault(require("./card.service"));
const store_product_service_1 = __importDefault(require("../store-product.service"));
class ChargeService extends stripe_api_1.default {
    constructor() {
        super(...arguments);
        this.stripeService = new stripe_service_1.default();
        this.cardService = new card_service_1.default();
    }
    getClient(customer) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.stripeService.getCustomer(customer);
        });
    }
    chargeOrder(payment, stockChange, pubsub) {
        return __awaiter(this, void 0, void 0, function* () {
            const userData = yield this.getClient(payment.customer);
            if (payment.token) {
                const cardCreate = yield this.cardService.createCard(payment.customer, payment.token);
                yield this.stripeService.updateCustomer(payment.customer, {
                    default_source: cardCreate.card.id,
                });
                yield this.cardService.removeOtherCards(payment.customer, cardCreate.card.id);
            }
            if (!payment.token && !userData.customer.default_source) {
                throw new bad_request_error_1.BadRequestError("This client doesn't have a default source (card)");
            }
            delete payment.token;
            payment.amount = Math.round(payment.amount * 100);
            return yield this.execute(stripe_api_1.STRIPE_OBJECTS.CHARGES, stripe_api_1.STRIPE_ACTIONS.CREATE, payment)
                .then((result) => {
                store_product_service_1.default.updateStock(stockChange, pubsub);
                return (0, custom_response_1.customResponse)(true, "The payment was successful", {
                    charge: result,
                });
            })
                .catch((e) => {
                console.log(e);
                throw new internal_server_error_1.InternalServerError("Payment Couldn't been made");
            });
        });
    }
    getChargesByCustomer(customer, limit = 5, startingAfter = "", endingBefore = "") {
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
            return yield this.execute(stripe_api_1.STRIPE_OBJECTS.CHARGES, stripe_api_1.STRIPE_ACTIONS.LIST, Object.assign({ limit,
                customer }, pagination))
                .then((result) => {
                return (0, custom_response_1.customResponse)(true, "Lista de charges cargada successfully", {
                    hasMore: result.has_more,
                    charges: result.data,
                });
            })
                .catch(() => {
                throw new internal_server_error_1.InternalServerError("Couldn't get the charges list");
            });
        });
    }
}
exports.default = ChargeService;
