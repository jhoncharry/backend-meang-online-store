import { User } from "../../models/user.model";
import { JWT } from "../../helpers/jwt";

import { BadRequestError } from "../../common/errors/bad-request-error";
import { NotAuthorizedError } from "../../common/errors/not-authorized-error";

import { customResponse } from "../../common/response/custom-response";

class AuthService {
  static async login(args: any, context: any) {
    const { email, password } = args;
    const { req } = context;

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

    return customResponse(true, "User logged", { user: existingUser });
  }

  static async logout(context: any) {
    const { req } = context;

    if (!req.session.jwt) throw new BadRequestError("Unable to logout");
    req.session = null;

    return { status: true, message: "logout" };
  }

  static async renewToken(context: any) {
    const { currentUser, req } = context;

    if (!currentUser) throw new NotAuthorizedError();
    // Generate Token - JWT
    const token = await JWT.sign({ user: currentUser });
    // Store it on session object
    req.session = {
      jwt: token,
    };

    return customResponse(true, "New token was generated", {
      user: currentUser,
    });
  }

  static async me(context: any) {
    const { currentUser } = context;

    if (!currentUser) throw new NotAuthorizedError();
    return customResponse(true, "Authenticated user", { user: currentUser });
  }
}

export default AuthService;
