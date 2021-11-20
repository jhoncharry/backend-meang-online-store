import { IResolvers } from "@graphql-tools/utils";
import StripeService from "../services/stripe/stripe.service";

const stripeSerice = new StripeService();

const stripe_query: IResolvers = {
  Query: {
    // Get customers
    async customers(_, { limit, startingAfter, endingBefore }) {
      return stripeSerice.getCustomers(limit, startingAfter, endingBefore);
    },

    // Get customer
    async customer(_, { id }) {
      return stripeSerice.getCustomer(id);
    },
  },
};

export default stripe_query;
