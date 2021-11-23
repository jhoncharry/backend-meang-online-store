import StripeApi, {
  STRIPE_ACTIONS,
  STRIPE_OBJECTS,
} from "../../../helpers/stripe-api";

import { customResponse } from "../../../common/response/custom-response";
import { InternalServerError } from "../../../common/errors/internal-server-error";
import StripeService from "./stripe.service";
import { BadRequestError } from "../../../common/errors/bad-request-error";
import CardService from "./card.service";

import { PubSub } from "apollo-server-express";
import StoreProductService from "../store-product.service";

class ChargeService extends StripeApi {
  private stripeService = new StripeService();
  private cardService = new CardService();

  private async getClient(customer: string) {
    return await this.stripeService.getCustomer(customer);
  }

  async chargeOrder(payment: any, stockChange: Array<any>, pubsub: PubSub) {
    // Check if customer exists
    const userData = await this.getClient(payment.customer);

    // Check if we have token
    if (payment.token) {
      // Asociar el client a la tarjeta
      const cardCreate = await this.cardService.createCard(
        payment.customer,
        payment.token
      );

      // Actualizar tarjeta como predeterminada
      await this.stripeService.updateCustomer(payment.customer, {
        default_source: cardCreate.card.id,
      });

      // Borrar las demas tarjetas de ese cliente
      await this.cardService.removeOtherCards(
        payment.customer,
        cardCreate.card.id
      );
    }

    if (!payment.token && !userData.customer.default_source) {
      throw new BadRequestError(
        "This client doesn't have a default source (card)"
      );
    }

    delete payment.token;
    // Convert to 0 decimal
    payment.amount = Math.round(payment.amount * 100);

    return await this.execute(
      STRIPE_OBJECTS.CHARGES,
      STRIPE_ACTIONS.CREATE,
      payment
    )
      .then((result) => {
        StoreProductService.updateStock(stockChange, pubsub);
        return customResponse(true, "The payment was successful", {
          charge: result,
        });
      })
      .catch((e) => {
        console.log(e);
        throw new InternalServerError("Payment Couldn't been made");
      });
  }

  async getChargesByCustomer(
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

    return await this.execute(STRIPE_OBJECTS.CHARGES, STRIPE_ACTIONS.LIST, {
      limit,
      customer,
      ...pagination,
    })
      .then((result: { has_more: boolean; data: any }) => {
        return customResponse(true, "Lista de charges cargada successfully", {
          hasMore: result.has_more,
          charges: result.data,
        });
      })
      .catch(() => {
        throw new InternalServerError("Couldn't get the charges list");
      });
  }
}

export default ChargeService;
