import { IResolvers } from "@graphql-tools/utils";

import StripeService from "../services/stripe/stripe.service";

const stripeSerice = new StripeService();

const stripe_mutation: IResolvers = {
  Mutation: {
    // Stripe - Create customer
    async createCustomer(_, { name, email }) {
      return stripeSerice.createCustomer(name, email);
    },

    // Update customer
    async updateCustomer(_, { id, customer }) {
      return stripeSerice.updateCustomer(id, customer);
    },

    // Delete customer
    async deleteCustomer(_, { id }) {
      return stripeSerice.deleteCustomer(id);
    },
  },
};

export default stripe_mutation;
