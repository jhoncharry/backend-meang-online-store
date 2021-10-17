import { User } from "../../models/user.model";

import {
  userCreateValidation,
  userDeleteValidation,
  userGetByIdValidation,
  userUpdateValidation,
} from "../../common/validators/user.validators";

import { BadRequestError } from "../../common/errors/bad-request-error";
import { InternalServerError } from "../../common/errors/internal-server-error";

import { validationInputs } from "../../common/validators/index.validation";
import { customResponse } from "../../common/response/custom-response";
import { pagination } from "../../helpers/pagination";

class UserService {
  static async register(userInput: any) {
    // user create validation
    let value = await validationInputs(userCreateValidation, userInput);

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
  }

  static async updateUser(userInput: any) {
    // user update  validation
    let value = await validationInputs(userUpdateValidation, userInput);

    // Check if the user already exists
    const userCheck = await User.findById(value._id);
    if (!userCheck) {
      throw new BadRequestError("This user doesn't exists");
    }

    userCheck.set(value);
    // Save User
    return await userCheck
      .save()
      .then((userUpdated) =>
        customResponse(true, "User Updated", { user: userUpdated })
      )
      .catch(() => {
        throw new InternalServerError("Couldn't save the data");
      });
  }

  static async deleteUser(userInput: any) {
    // user update  validation
    let value = await validationInputs(userDeleteValidation, userInput);

    // Check if the user already exists
    const userCheck = await User.findById(value._id);
    if (!userCheck) {
      throw new BadRequestError("This user doesn't exists");
    }

    // Delete User
    return await userCheck
      .remove()
      .then((userDeleted) =>
        customResponse(true, "User Deleted", { user: userDeleted })
      )
      .catch(() => {
        throw new InternalServerError("Couldn't save the data");
      });
  }

  static async getUsers(paginationOptions: any) {
    const page = paginationOptions.page || 1;
    const itemsPage = paginationOptions.itemsPage || 20;

    try {
      const paginationData = await pagination(page, itemsPage, User);
      if (page > paginationData.pages) {
        throw new BadRequestError("No data result");
      }

      return customResponse(true, "User list", {
        users: await User.find()
          .skip(paginationData.skip)
          .limit(paginationData.itemsPage)
          .exec(),

        info: {
          page: paginationData.page,
          pages: paginationData.pages,
          itemsPage: paginationData.itemsPage,
          total: paginationData.total,
        },
      });
    } catch (error) {
      if (error instanceof BadRequestError) return error;
      throw new InternalServerError("Something went wrong...");
    }
  }

  static async getUser(userInput: any) {
    // user _id validation
    let value = await validationInputs(userGetByIdValidation, userInput);

    // Check if the user exists with that email and remove registerDate from query and User document result
    const existingUser = await User.findOne({ _id: value._id });
    if (!existingUser) {
      throw new BadRequestError("User Doesn't exist");
    }
    return customResponse(true, "User by ID", {
      user: existingUser,
    });
  }
}

export default UserService;
