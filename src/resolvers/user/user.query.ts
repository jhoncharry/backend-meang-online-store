import { IResolvers } from "@graphql-tools/utils";

import { InternalServerError } from "../../common/errors/internal-server-error";
import { customResponse } from "../../common/response/custom-response";
import { BadRequestError } from "../../common/errors/bad-request-error";

import { User } from "../../models/user.model";
import { JWT } from "../../helpers/jwt";
import { NotAuthorizedError } from "../../common/errors/not-authorized-error";

const user_query: IResolvers = {
  Query: {
    // Get users
    async users(_, __) {
      try {
        return customResponse(true, "Users list", { users: await User.find() });
      } catch (error) {
        throw new InternalServerError("Couldn't get the data");
      }
    },

    //Login
    async login(_, { email, password }, { req }) {
      // Check if the user exists with that email and remove registerDate from query and User document result
      const existingUser = await User.findOne({ email }).select(
        "-registerDate -birthday"
      );
      if (!existingUser) {
        throw new BadRequestError("Invalid credentials");
      }

      // Check if the user's password do matches
      const passwordsMatch = await existingUser.comparePassword(password);
      if (!passwordsMatch) {
        throw new BadRequestError("Invalid credentials");
      }

      // Generate Token - JWT
      const token = await JWT.sign({ user: existingUser });
      // Store it on session object
      req.session = {
        jwt: token,
      };

      return customResponse(true, "User logged", { token, user: existingUser });
    },

    //Singout
    async logout(_, __, { req }) {
      if (!req.session.jwt) throw new BadRequestError("Unable to logout");
      req.session = null;

      return { status: true, message: "logout" };
    },

    //Renew token
    async renewToken(_, __, { req, currentUser }) {
      if (!currentUser) throw new NotAuthorizedError();

      // Generate Token - JWT
      const token = await JWT.sign({ user: currentUser });
      // Store it on session object
      req.session = {
        jwt: token,
      };

      return customResponse(true, "New token was generated", {
        token,
        user: currentUser,
      });
    },

    // me
    async me(_, __, { currentUser }) {
      if (!currentUser) throw new NotAuthorizedError();
      return customResponse(true, "Authenticated user", { user: currentUser });
    },
  },
};

export default user_query;
