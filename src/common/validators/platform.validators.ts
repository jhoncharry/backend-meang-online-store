import Joi from "joi";

const id = Joi.number();

export const platformGetByIdValidation = Joi.object().keys({
  id: id.required(),
});

export const platformGetByMultipleIdsValidation = Joi.object().keys({
  id: Joi.array().min(1).items(Joi.number()).required(),
});
