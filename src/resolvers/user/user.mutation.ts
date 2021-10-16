import { IResolvers } from "@graphql-tools/utils";

import UserService from "../services/user.service";

const user_mutation: IResolvers = {
  Mutation: {
    // User register
    async register(_, { userInput }) {
      console.log("tatatata", userInput);
      return await UserService.register(userInput);
    },
    // Update user
    async updateUser(_, { userInput }) {
      return await UserService.updateUser(userInput);
    },
    async deleteUser(_, userInput) {
      return await UserService.deleteUser(userInput);
    },
  },
};

export default user_mutation;
