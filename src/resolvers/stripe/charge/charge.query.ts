import { IResolvers } from "@graphql-tools/utils";

import ChargeService from "../../services/stripe/charge.service";

const chargeService = new ChargeService();

const charge_query: IResolvers = {
  Query: {
    // Get charges by customer
    async chargesByCustomer(_, { customer, limit, startingAfter, endingBefore }) {
      return chargeService.getChargesByCustomer(
        customer,
        limit,
        startingAfter,
        endingBefore
      );
    },
  },
};

export default charge_query;
