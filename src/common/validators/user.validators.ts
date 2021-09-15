import Joi from "joi";
import { UserRoles } from "../../models/types/user-roles";

const name = Joi.string().alphanum().min(3).max(38).required();
const lastname = Joi.string().alphanum().min(3).max(38).required();
const email = Joi.string().email().required();
const password = Joi.string().alphanum().min(3).max(38).required();
const birthday = Joi.string();
const role = Joi.string()
  .valid(...Object.values(UserRoles))
  .messages({ "any.only": "Must be a valid role" });

export const userCreateValidation = Joi.object().keys({
  name,
  lastname,
  email,
  password,
  birthday,
  role,
});
