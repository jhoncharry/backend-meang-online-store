"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const constants_1 = require("../../config/constants");
const subscription = {
    Subscription: {
        updateStockProduct: {
            subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(constants_1.SUBSCRIPTIONS_EVENT.UPDATE_STOCK_PRODUCT),
        },
        selectProductStockUpdate: {
            subscribe: (0, apollo_server_express_1.withFilter)((_, __, { pubsub }) => pubsub.asyncIterator(constants_1.SUBSCRIPTIONS_EVENT.UPDATE_STOCK_PRODUCT), (payload, variables) => {
                return +payload.selectProductStockUpdate.id === +variables.id;
            }),
        },
    },
};
exports.default = subscription;
