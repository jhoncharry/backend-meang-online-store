import { BadRequestError } from "../../common/errors/bad-request-error";
import { NotAuthorizedError } from "../../common/errors/not-authorized-error";
import { customResponse } from "../../common/response/custom-response";
import { transport } from "../../config/mailer";
import { JWT } from "../../helpers/jwt";
import { User } from "../../models/user.model";
import UserService from "./user.service";

class EmailService {
  static async sendEmail(msg: any) {
    return new Promise((resolve, reject) => {
      transport.sendMail(msg, (error, info) => {
        error ? reject(false) : resolve(true);
      });
    });
  }
  static async sendUserActivateEmail(email: string) {
    const checkUser = await User.findOne({ email });

    if (!checkUser) {
      throw new BadRequestError("This email doesn't exists");
    }

    if (checkUser.active === true) {
      throw new BadRequestError("This user is already activated");
    }

    const token = await JWT.sign({ user: { _id: checkUser._id, email } });
    const html = `to activate your account click on the following button <a href="${process.env.CLIENT_URL}/#/active/${token}">Click here</a>`;

    const msg = {
      from: {
        name: "🕹️ Gamezonia Online Store 🕹️ 👻",
        address: "jhon.charrysoftware@gmail.com",
      },
      to: email,
      subject: "User activation",
      html,
    };

    const checkEmail = await this.sendEmail(msg);
    if (!checkEmail) throw new BadRequestError("Unable to send e-mail");

    return customResponse(
      true,
      `Email for user activation has been sent to ${email}`
    );
  }

  static async verifyUserActivateEmail(req: any) {
    //  Recieve and validate token
    const token = req ? req.headers.authorization : null;

    const currentUserToActiveAccount = JWT.verify(token);
    if (!currentUserToActiveAccount) throw new NotAuthorizedError();

    const { _id, email } = currentUserToActiveAccount;

    const checkUser = await User.findById(_id);
    if (!checkUser) {
      throw new BadRequestError("This user doesn't exists");
    }

    if (checkUser.active === true) {
      throw new BadRequestError("This user is already activated");
    }

    await UserService.unblockUser({ _id, unblock: true });

    const html = "<b>Successful user activation, now you can log in.</b>";

    const msg = {
      from: {
        name: "🕹️ Gamezonia Online Store 🕹️ 👻",
        address: "jhon.charrysoftware@gmail.com",
      },
      to: email,
      subject: "User activation successful",
      html,
    };

    const checkEmail = await this.sendEmail(msg);
    if (!checkEmail) throw new BadRequestError("Unable to send e-mail");

    return customResponse(
      true,
      `Email on succesful user activation has been sent to ${email}`
    );
  }

  static async sendUserResetPasswordEmail(email: string) {
    console.log("Email", email);
    const checkUser = await User.findOne({ email });

    if (!checkUser) {
      throw new BadRequestError("This email doesn't exists");
    }

    const token = await JWT.sign({ user: { _id: checkUser._id, email } });
    const html = `to reset your password click on the following button <a href="${process.env.CLIENT_URL}/#/reset/${token}">Click here</a>`;

    const msg = {
      from: {
        name: "🕹️ Gamezonia Online Store 🕹️ 👻",
        address: "jhon.charrysoftware@gmail.com",
      },
      to: email,
      subject: "Reset user password",
      html,
    };

    const checkEmail = await this.sendEmail(msg);
    if (!checkEmail) throw new BadRequestError("Unable to send e-mail");

    return customResponse(
      true,
      `Email for reset user password has been sent to ${email}`
    );
  }

  static async verifyUserResetPasswordEmail(password: string, req: any) {
    //  Recieve and validate token
    const token = req ? req.headers.authorization : null;

    const currentUserToResetPassword = JWT.verify(token);
    if (!currentUserToResetPassword) throw new NotAuthorizedError();

    const { _id, email } = currentUserToResetPassword;

    const checkUser = await User.findById(_id);
    if (!checkUser) {
      throw new BadRequestError("This user doesn't exists");
    }

    await UserService.changePassword({ _id, password });

    const html = "<b>Successful reset user password, now you can log in.</b>";

    const msg = {
      from: {
        name: "🕹️ Gamezonia Online Store 🕹️ 👻",
        address: "jhon.charrysoftware@gmail.com",
      },
      to: email,
      subject: "Reset user password Successfully",
      html,
    };

    const checkEmail = await this.sendEmail(msg);
    if (!checkEmail) throw new BadRequestError("Unable to send e-mail");

    return customResponse(
      true,
      `Email on succesful reset user password has been sent to ${email}`
    );
  }
}

export default EmailService;
