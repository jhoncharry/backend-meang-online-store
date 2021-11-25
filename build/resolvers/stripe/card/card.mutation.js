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
const card_service_1 = __importDefault(require("../../services/stripe/card.service"));
const cardSerice = new card_service_1.default();
const card_mutation = {
    Mutation: {
        createCardToken(_, { card }) {
            return __awaiter(this, void 0, void 0, function* () {
                return cardSerice.createCardToken(card);
            });
        },
        createCard(_, { customer, tokenCard }) {
            return __awaiter(this, void 0, void 0, function* () {
                return cardSerice.createCard(customer, tokenCard);
            });
        },
        updateCard(_, { customer, card, details }) {
            return __awaiter(this, void 0, void 0, function* () {
                return cardSerice.updateCard(customer, card, details);
            });
        },
        deleteCard(_, { customer, card }) {
            return __awaiter(this, void 0, void 0, function* () {
                return cardSerice.deleteCard(customer, card);
            });
        },
    },
};
exports.default = card_mutation;
