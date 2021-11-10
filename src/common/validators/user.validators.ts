import Joi from "joi";
import { UserRoles } from "../../models/types/user-roles";

import ObjectId from "mongoose";

/* 
Good example of name properity

const name = Joi.string()
  .regex(/^[a-zA-Z]+(([\'\,\.\- ][a-zA-Z ])?[a-zA-Z]*)*$/)
  .min(3)
  .max(38)
  .required()
  .messages({
    "string.pattern.base": "Must be a valid name",
  }); 
  
  */

const _id = Joi.string().custom((value, helper) => {
  if (!ObjectId.isValidObjectId(value)) {
    return helper.message({ custom: "_id must be Object Id" });
  }
  return value;
});
//  const _id = Joi.string();
const name = Joi.string().min(3).max(38);
const lastname = Joi.string().min(3).max(38);
const email = Joi.string().email();
const password = Joi.string().alphanum().min(3).max(38);
const birthday = Joi.string();
const role = Joi.string()
  .valid(...Object.values(UserRoles))
  .messages({ "any.only": "Must be a valid role" });

const unblock = Joi.boolean();

export const userCreateValidation = Joi.object().keys({
  name: name.required(),
  lastname: lastname.required(),
  email: email.required(),
  password: password.required(),
  birthday,
  role,
});

export const userUpdateValidation = Joi.object().keys({
  _id: _id.required(),
  name,
  lastname,
  email,
  password,
  birthday,
  role,
});

export const userDeleteValidation = Joi.object().keys({
  _id: _id.required(),
});

export const userGetByIdValidation = Joi.object().keys({
  _id: _id.required(),
});

export const userUnblockValidation = Joi.object().keys({
  _id: _id.required(),
  unblock: unblock.required(),
});

export const userChangePasswordValidation = Joi.object().keys({
  _id: _id.required(),
  password: password.required(),
});
