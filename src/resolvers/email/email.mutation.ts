import { IResolvers } from "@graphql-tools/utils";
import { BadRequestError } from "../../common/errors/bad-request-error";
import { customResponse } from "../../common/response/custom-response";
import EmailService from "../services/email.service";

const email_mutation: IResolvers = {
  Mutation: {
    // Send test email
    async sendEmail(_, { mail }) {
      const msg = {
        from: {
          name: "🕹️ Gamezonia Online Store 🕹️ 👻",
          address: "jhon.charrysoftware@gmail.com",
        },
        to: mail.to,
        subject: mail.subject,
        html: mail.html,
      };

      const email = await EmailService.sendEmail(msg);
      if (!email) throw new BadRequestError("Unable to send e-mail");

      return customResponse(true, `Test email has been sent to ${mail.to}`);
    },
    // User email activate
    async sendUserActivateEmail(_, { email }) {
      return await EmailService.sendUserActivateEmail(email);
    },
    //  Activate user action
    async verifyUserActivateEmail(_, __, { req }) {
      return await EmailService.verifyUserActivateEmail(req);
    },

    //  Reset user password by email
    async sendUserResetPasswordEmail(_, { email }) {
      return await EmailService.sendUserResetPasswordEmail(email);
    },

    //  Verify user reset password email
    async verifyUserResetPasswordEmail(_, { password }, { req }) {
      return await EmailService.verifyUserResetPasswordEmail(password, req);
    },
  },
};

export default email_mutation;
