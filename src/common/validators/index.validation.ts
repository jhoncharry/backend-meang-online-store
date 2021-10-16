import { UserInputError } from "apollo-server-express";
import Joi from "joi";

export const validationInputs = async (
  validationType: Joi.ObjectSchema<any>,
  dataValidation: any
) => {
  return await validationType
    .validateAsync(dataValidation, {
      abortEarly: false,
      errors: {
        wrap: {
          label: "",
        },
      },
    })
    .catch((error: any) => {
      throw new UserInputError("Input field validation failure", {
        validationErrors: error.details,
      });
    });
};
