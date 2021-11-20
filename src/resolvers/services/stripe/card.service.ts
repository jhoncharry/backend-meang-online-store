import StripeApi, {
  STRIPE_ACTIONS,
  STRIPE_OBJECTS,
} from "../../../helpers/stripe-api";

import { customResponse } from "../../../common/response/custom-response";
import { InternalServerError } from "../../../common/errors/internal-server-error";

class CardService extends StripeApi {
  async createCardToken(card: any) {
    return await this.execute(STRIPE_OBJECTS.TOKENS, STRIPE_ACTIONS.CREATE, {
      card: {
        number: card.number,
        exp_month: card.expMonth,
        exp_year: card.expYear,
        cvc: card.cvc,
      },
    })
      .then((result) => {
        return customResponse(true, "Token was created", {
          token: result.id,
        });
      })
      .catch(() => {
        throw new InternalServerError("Couldn't create token");
      });
  }

  async createCard(customer: string, tokenCard: string) {
    return await this.execute(
      STRIPE_OBJECTS.CUSTOMERS,
      STRIPE_ACTIONS.CREATE_SOURCE,
      customer,
      {
        source: tokenCard,
      }
    )
      .then((result) => {
        return customResponse(true, "Card was created", {
          id: result.id,
          card: result,
        });
      })
      .catch(() => {
        throw new InternalServerError("Couldn't create token");
      });
  }

  async getCard(customer: string, card: string) {
    return await this.execute(
      STRIPE_OBJECTS.CUSTOMERS,
      STRIPE_ACTIONS.GET_SOURCE,
      customer,
      card
    )
      .then((result) => {
        return customResponse(true, "Card details successfully", {
          id: result.id,
          card: result,
        });
      })
      .catch((e) => {
        console.log(e);
        throw new InternalServerError("Couldn't get card details");
      });
  }
  async updateCard(customer: string, card: string, details: any) {
    return await this.execute(
      STRIPE_OBJECTS.CUSTOMERS,
      STRIPE_ACTIONS.UPDATE_SOURCE,
      customer,
      card,
      details
    )
      .then((result) => {
        return customResponse(true, "Card updated successful", {
          id: result.id,
          card: result,
        });
      })
      .catch((e) => {
        console.log(e);
        throw new InternalServerError("Couldn't update card details");
      });
  }

  async deleteCard(customer: string, card: string) {
    return await this.execute(
      STRIPE_OBJECTS.CUSTOMERS,
      STRIPE_ACTIONS.DELETE_SOURCE,
      customer,
      card
    )
      .then((result) => {
        return customResponse(true, "Card deleted successful", {
          id: result.id,
        });
      })
      .catch((e) => {
        console.log(e);
        throw new InternalServerError("Couldn't deleted card details");
      });
  }

  async getCards(
    customer: string,
    limit: number = 5,
    startingAfter: string = "",
    endingBefore: string = ""
  ) {
    let pagination;

    if (startingAfter !== "" && endingBefore === "") {
      pagination = { starting_after: startingAfter };
    } else if (startingAfter === "" && endingBefore !== "") {
      pagination = { ending_before: endingBefore };
    } else {
      pagination = {};
    }

    return await this.execute(
      STRIPE_OBJECTS.CUSTOMERS,
      STRIPE_ACTIONS.GET_SOURCES,
      customer,
      {
        object: "card",
        limit,
        ...pagination,
      }
    )
      .then((result: { has_more: boolean; data: any }) => {
        return customResponse(true, "Lista de tarjetas cargada successfully", {
          hasMore: result.has_more,
          cards: result.data,
        });
      })
      .catch(() => {
        throw new InternalServerError("Couldn't get the card list");
      });
  }
  async removeOtherCards(customer: string, noDeleteCard: string) {
    const listCards = (await this.getCards(customer)).cards;

    listCards.map(async (item: any) => {
      if (noDeleteCard && item.id !== noDeleteCard) {
        await this.deleteCard(customer, item.id);
      }
    });
  }
}

export default CardService;
