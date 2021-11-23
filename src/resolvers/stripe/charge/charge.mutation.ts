import { IResolvers } from "@graphql-tools/utils";
import ChargeService from "../../services/stripe/charge.service";

const chargeService = new ChargeService();

const charge_mutation: IResolvers = {
  Mutation: {
    // Create card token
    async chargeOrder(_, { payment, stockChange }, { pubsub }) {
      return chargeService.chargeOrder(payment, stockChange, pubsub);
    },
  },
};

export default charge_mutation;
