import Joi from "joi";

const id = Joi.number();
const name = Joi.string().min(3).max(38);

export const genreCreateValidation = Joi.object().keys({
  name: name.required(),
});

export const genreUpdateValidation = Joi.object().keys({
  id: id.required(),
  name,
});

export const genreDeleteValidation = Joi.object().keys({
  id: id.required(),
});

export const genreGetByIdValidation = Joi.object().keys({
  id: id.required(),
});
