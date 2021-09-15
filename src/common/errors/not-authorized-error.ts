import { ApolloError } from "apollo-server-errors";

export class NotAuthorizedError extends ApolloError {
  constructor() {
    super("Not Authorized", "NOT_AUTHORIZED_ERROR");

    Object.defineProperty(this, "name", { value: "NotAuthorizedError" });
  }
}
