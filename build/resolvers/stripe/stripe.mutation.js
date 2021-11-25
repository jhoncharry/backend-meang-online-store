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
const stripe_service_1 = __importDefault(require("../services/stripe/stripe.service"));
const stripeSerice = new stripe_service_1.default();
const stripe_mutation = {
    Mutation: {
        createCustomer(_, { name, email }) {
            return __awaiter(this, void 0, void 0, function* () {
                return stripeSerice.createCustomer(name, email);
            });
        },
        updateCustomer(_, { id, customer }) {
            return __awaiter(this, void 0, void 0, function* () {
                return stripeSerice.updateCustomer(id, customer);
            });
        },
        deleteCustomer(_, { id }) {
            return __awaiter(this, void 0, void 0, function* () {
                return stripeSerice.deleteCustomer(id);
            });
        },
    },
};
exports.default = stripe_mutation;
