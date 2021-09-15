import { IResolvers } from "@graphql-tools/utils";

import { userCreateValidation } from "../../common/validators/user.validators";

import { UserInputError } from "apollo-server-errors";
import { BadRequestError } from "../../common/errors/bad-request-error";
import { InternalServerError } from "../../common/errors/internal-server-error";
import { customResponse } from "../../common/response/custom-response";

import { User } from "../../models/user.model";

const user_mutation: IResolvers = {
  Mutation: {
    // User register
    async register(_, { userInput }) {
      // user create validation
      let value = await userCreateValidation
        .validateAsync(userInput, {
          abortEarly: false,
          errors: {
            wrap: {
              label: "",
            },
          },
        })
        .catch((error) => {
          throw new UserInputError(
            "Failed to create user due to validation errors",
            {
              validationErrors: error.details,
            }
          );
        });

      // Added register date ISO format
      value.registerDate = new Date().toISOString();

      // Check if the user already exists
      const userCheck = await User.findOne({ email: value.email });
      if (userCheck) {
        throw new BadRequestError("This user already exists");
      }

      const user = new User(value);

      // Save User
      return await user
        .save()
        .then((userSaved) =>
          customResponse(true, "User created", { user: userSaved })
        )
        .catch(() => {
          throw new InternalServerError("Couldn't save the data");
        });
    },
  },
};

export default user_mutation;
