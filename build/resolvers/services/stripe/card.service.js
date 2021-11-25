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
class CardService extends stripe_api_1.default {
    createCardToken(card) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.execute(stripe_api_1.STRIPE_OBJECTS.TOKENS, stripe_api_1.STRIPE_ACTIONS.CREATE, {
                card: {
                    number: card.number,
                    exp_month: card.expMonth,
                    exp_year: card.expYear,
                    cvc: card.cvc,
                },
            })
                .then((result) => {
                return (0, custom_response_1.customResponse)(true, "Token was created", {
                    token: result.id,
                });
            })
                .catch(() => {
                throw new internal_server_error_1.InternalServerError("Couldn't create token");
            });
        });
    }
    createCard(customer, tokenCard) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.execute(stripe_api_1.STRIPE_OBJECTS.CUSTOMERS, stripe_api_1.STRIPE_ACTIONS.CREATE_SOURCE, customer, {
                source: tokenCard,
            })
                .then((result) => {
                return (0, custom_response_1.customResponse)(true, "Card was created", {
                    id: result.id,
                    card: result,
                });
            })
                .catch(() => {
                throw new internal_server_error_1.InternalServerError("Couldn't create token");
            });
        });
    }
    getCard(customer, card) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.execute(stripe_api_1.STRIPE_OBJECTS.CUSTOMERS, stripe_api_1.STRIPE_ACTIONS.GET_SOURCE, customer, card)
                .then((result) => {
                return (0, custom_response_1.customResponse)(true, "Card details successfully", {
                    id: result.id,
                    card: result,
                });
            })
                .catch((e) => {
                console.log(e);
                throw new internal_server_error_1.InternalServerError("Couldn't get card details");
            });
        });
    }
    updateCard(customer, card, details) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.execute(stripe_api_1.STRIPE_OBJECTS.CUSTOMERS, stripe_api_1.STRIPE_ACTIONS.UPDATE_SOURCE, customer, card, details)
                .then((result) => {
                return (0, custom_response_1.customResponse)(true, "Card updated successful", {
                    id: result.id,
                    card: result,
                });
            })
                .catch((e) => {
                console.log(e);
                throw new internal_server_error_1.InternalServerError("Couldn't update card details");
            });
        });
    }
    deleteCard(customer, card) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.execute(stripe_api_1.STRIPE_OBJECTS.CUSTOMERS, stripe_api_1.STRIPE_ACTIONS.DELETE_SOURCE, customer, card)
                .then((result) => {
                return (0, custom_response_1.customResponse)(true, "Card deleted successful", {
                    id: result.id,
                });
            })
                .catch((e) => {
                console.log(e);
                throw new internal_server_error_1.InternalServerError("Couldn't deleted card details");
            });
        });
    }
    getCards(customer, limit = 5, startingAfter = "", endingBefore = "") {
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
            return yield this.execute(stripe_api_1.STRIPE_OBJECTS.CUSTOMERS, stripe_api_1.STRIPE_ACTIONS.GET_SOURCES, customer, Object.assign({ object: "card", limit }, pagination))
                .then((result) => {
                return (0, custom_response_1.customResponse)(true, "Lista de tarjetas cargada successfully", {
                    hasMore: result.has_more,
                    cards: result.data,
                });
            })
                .catch(() => {
                throw new internal_server_error_1.InternalServerError("Couldn't get the card list");
            });
        });
    }
    removeOtherCards(customer, noDeleteCard) {
        return __awaiter(this, void 0, void 0, function* () {
            const listCards = (yield this.getCards(customer)).cards;
            listCards.map((item) => __awaiter(this, void 0, void 0, function* () {
                if (noDeleteCard && item.id !== noDeleteCard) {
                    yield this.deleteCard(customer, item.id);
                }
            }));
        });
    }
}
exports.default = CardService;
