import { IResolvers } from "@graphql-tools/utils";

import UserService from "../services/user.service";
import AuthService from "../services/auth.service";

const user_query: IResolvers = {
  Query: {
    // Get users
    async users(_, __) {
      return await UserService.getUsers();
    },

    // Get user
    async user(_, userInput) {
      return await UserService.getUser(userInput);
    },

    //Login
    async login(_, args, { req }) {
      return await AuthService.login(args, { req });
    },

    //Singout
    async logout(_, __, { req }) {
      return await AuthService.logout({ req });
    },

    //Renew token
    async renewToken(_, __, context) {
      return await AuthService.renewToken(context);
    },

    // Me
    async me(_, __, { currentUser }) {
      return AuthService.me({ currentUser });
    },
  },
};

export default user_query;
