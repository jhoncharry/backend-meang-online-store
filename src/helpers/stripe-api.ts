export const STRIPE_OBJECTS = {
  CUSTOMERS: "customers",
  TOKENS: "tokens",
  CHARGES: "charges",
};

export const STRIPE_ACTIONS = {
  CREATE: "create",
  UPDATE: "update",
  DELETE: "del",
  GET: "retrieve",
  LIST: "list",
  CREATE_SOURCE: "createSource",
  UPDATE_SOURCE: "updateSource",
  DELETE_SOURCE: "deleteSource",
  GET_SOURCE: "retrieveSource",
  GET_SOURCES: "listSources",
};

class StripeApi {
  private stripe = require("stripe")(process.env.STRIPE_API_KEY, {
    apiVersion: process.env.STRIPE_API_VERSION,
  });

  protected async execute(
    object: string,
    action: string,
    ...args: [string | object, (string | object)?, (string | object)?]
  ) {
    return await this.stripe[object][action](...args);
  }
}

export default StripeApi;
