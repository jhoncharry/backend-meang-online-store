import { IResolvers } from "@graphql-tools/utils";
import { withFilter } from "apollo-server-express";
import { SUBSCRIPTIONS_EVENT } from "../../config/constants";

import StoreProductService from "../services/store-product.service";

const subscription: IResolvers = {
  Subscription: {
    updateStockProduct: {
      subscribe: (_, __, { pubsub }) =>
        pubsub.asyncIterator(SUBSCRIPTIONS_EVENT.UPDATE_STOCK_PRODUCT),
    },
    selectProductStockUpdate: {
      subscribe: withFilter(
        (_, __, { pubsub }) =>
          pubsub.asyncIterator(SUBSCRIPTIONS_EVENT.UPDATE_STOCK_PRODUCT),
        (payload, variables) => {
          return +payload.selectProductStockUpdate.id === +variables.id;
        }
      ),
    },
  },
};

export default subscription;
