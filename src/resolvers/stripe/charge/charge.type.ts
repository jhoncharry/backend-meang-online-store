import { IResolvers } from "@graphql-tools/utils";
import StripeService from "../../services/stripe/stripe.service";

const stripeService = new StripeService();

const charge_type: IResolvers = {
  StripeCharge: {
    typeOrder: (parent) => parent.object,
    amount: (parent) => parent.amount / 100,
    receiptEmail: async (parent) => {
      if (parent.receipt_email) {
        return parent.receipt_email;
      }
      const userData = await stripeService.getCustomer(parent.customer);
      return userData.customer.email ? userData.customer.email : "";
    },
    receiptUrl: (parent) => parent.receipt_url,
    card: (parent) => parent.payment_method,
    created: (parent) => new Date(parent.created * 1000).toISOString(),
  },
};

export default charge_type;
