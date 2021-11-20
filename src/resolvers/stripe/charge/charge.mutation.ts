import { IResolvers } from "@graphql-tools/utils";
import ChargeService from "../../services/stripe/charge.service";

const chargeService = new ChargeService();

const charge_mutation: IResolvers = {
  Mutation: {
    // Create card token
    async chargeOrder(_, { payment }) {
      return chargeService.chargeOrder(payment);
    },
  },
};

export default charge_mutation;
