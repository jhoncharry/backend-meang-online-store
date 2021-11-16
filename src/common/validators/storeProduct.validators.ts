import Joi from "joi";

const id = Joi.number();

export const storeProductGetByIdValidation = Joi.object().keys({
  id: id.required(),
});
