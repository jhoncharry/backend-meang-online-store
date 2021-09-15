import { ApolloError } from "apollo-server-errors";

export class BadRequestError extends ApolloError {
  constructor(message: string) {
    super(message, "BAD_REQUEST_ERROR");

    Object.defineProperty(this, "name", { value: "BadRequestError" });
  }
}
