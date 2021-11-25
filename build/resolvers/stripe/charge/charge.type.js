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
const stripe_service_1 = __importDefault(require("../../services/stripe/stripe.service"));
const stripeService = new stripe_service_1.default();
const charge_type = {
    StripeCharge: {
        typeOrder: (parent) => parent.object,
        amount: (parent) => parent.amount / 100,
        receiptEmail: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            if (parent.receipt_email) {
                return parent.receipt_email;
            }
            const userData = yield stripeService.getCustomer(parent.customer);
            return userData.customer.email ? userData.customer.email : "";
        }),
        receiptUrl: (parent) => parent.receipt_url,
        card: (parent) => parent.payment_method,
        created: (parent) => new Date(parent.created * 1000).toISOString(),
    },
};
exports.default = charge_type;
