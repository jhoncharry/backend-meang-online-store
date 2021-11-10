import { User } from "../../models/user.model";

import {
  userChangePasswordValidation,
  userCreateValidation,
  userDeleteValidation,
  userGetByIdValidation,
  userUnblockValidation,
  userUpdateValidation,
} from "../../common/validators/user.validators";

import { BadRequestError } from "../../common/errors/bad-request-error";
import { InternalServerError } from "../../common/errors/internal-server-error";

import { validationInputs } from "../../common/validators/index.validation";
import { customResponse } from "../../common/response/custom-response";
import { pagination } from "../../helpers/pagination";
import EmailService from "./email.service";
import { ActiveValues } from "../../models/types/user-active";

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

    // Added inactive user field
    value.active = false;

    const user = new User(value);

    // Save User
    const userSaved = await user.save();
    if (!userSaved) {
      throw new InternalServerError("Couldn't save the data");
    }

    await EmailService.sendUserActivateEmail(userSaved.email);
    return customResponse(true, "User created", { user: userSaved });
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

  static async unblockUser(userInput: any) {
    // user update validation
    let value = await validationInputs(userUnblockValidation, userInput);

    // Check if the user id already exists
    const userCheck = await User.findById(value._id);
    if (!userCheck) {
      throw new BadRequestError("This user id doesn't exists");
    }

    userCheck.set({ active: value.unblock });

    const action = value.unblock ? "Unblocked" : "Blocked";

    // Save genre
    return await userCheck
      .save()
      .then((user) => {
        return customResponse(true, `User ${action}`, { user });
      })
      .catch(() => {
        throw new InternalServerError("Couldn't block the user");
      });
  }

  static async getUsers(paginationOptions: any) {
    const page = paginationOptions.page || 1;
    const itemsPage = paginationOptions.itemsPage || 20;
    const active = paginationOptions.active || ActiveValues.ACTIVE;

    let activeFilter = {};

    if (active === ActiveValues.ACTIVE) {
      activeFilter = { active: { $ne: false } };
    }
    if (active === ActiveValues.INACTIVE) {
      activeFilter = { active: false };
    }

    try {
      const paginationData = await pagination(
        page,
        itemsPage,
        User,
        activeFilter
      );
      if (page > paginationData.pages) {
        throw new BadRequestError("No data result");
      }

      return customResponse(true, "User list", {
        users: await User.find(activeFilter)
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

  static async changePassword(userInput: any) {
    // user update  validation
    let value = await validationInputs(userChangePasswordValidation, userInput);

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
        customResponse(true, "Change user password Successfully", {
          user: userUpdated,
        })
      )
      .catch(() => {
        throw new InternalServerError("Couldn't save the data");
      });
  }
}

export default UserService;
