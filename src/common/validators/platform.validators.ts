import Joi from "joi";

const id = Joi.number();

export const platformGetByIdValidation = Joi.object().keys({
  id: id.required(),
});
