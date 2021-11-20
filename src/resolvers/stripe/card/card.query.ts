import { IResolvers } from "@graphql-tools/utils";
import CardService from "../../services/stripe/card.service";

const cardSerice = new CardService();

const card_query: IResolvers = {
  Query: {
    // Get card
    async card(_, { customer, card }) {
      return cardSerice.getCard(customer, card);
    },

    // Get cards
    async cards(_, { customer, limit, startingAfter, endingBefore }) {
      return cardSerice.getCards(customer, limit, startingAfter, endingBefore);
    },
  },
};

export default card_query;
