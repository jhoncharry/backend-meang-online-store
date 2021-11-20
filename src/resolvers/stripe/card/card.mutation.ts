import { IResolvers } from "@graphql-tools/utils";
import CardService from "../../services/stripe/card.service";

const cardSerice = new CardService();

const card_mutation: IResolvers = {
  Mutation: {
    // Create card token
    async createCardToken(_, { card }) {
      return cardSerice.createCardToken(card);
    },

    // Create card
    async createCard(_, { customer, tokenCard }) {
      return cardSerice.createCard(customer, tokenCard);
    },

    // Update card
    async updateCard(_, { customer, card, details }) {
      return cardSerice.updateCard(customer, card, details);
    },

    // Update card
    async deleteCard(_, { customer, card }) {
      return cardSerice.deleteCard(customer, card);
    },
  },
};

export default card_mutation;
