import { IResolvers } from "@graphql-tools/utils";

import UserService from "../services/user.service";

const user_mutation: IResolvers = {
  Mutation: {
    // User register
    async register(_, { userInput }) {
      return await UserService.register(userInput);
    },
    // Update user
    async updateUser(_, { userInput }) {
      return await UserService.updateUser(userInput);
    },
    // Delete user
    async deleteUser(_, userInput) {
      return await UserService.deleteUser(userInput);
    },
    // Block user
    async unblockUser(_, userInput) {
      return await UserService.unblockUser(userInput);
    },
  },
};

export default user_mutation;
