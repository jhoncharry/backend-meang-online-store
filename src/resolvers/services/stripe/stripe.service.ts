import StripeApi, {
  STRIPE_ACTIONS,
  STRIPE_OBJECTS,
} from "../../../helpers/stripe-api";

import { customResponse } from "../../../common/response/custom-response";
import { InternalServerError } from "../../../common/errors/internal-server-error";
import { BadRequestError } from "../../../common/errors/bad-request-error";
import { User } from "../../../models/user.model";

class StripeService extends StripeApi {
  async getCustomers(
    limit: number,
    startingAfter: string,
    endingBefore: string
  ) {
    let pagination;

    if (startingAfter !== "" && endingBefore === "") {
      pagination = { starting_after: startingAfter };
    } else if (startingAfter === "" && endingBefore !== "") {
      pagination = { ending_before: endingBefore };
    } else {
      pagination = {};
    }

    return await this.execute(STRIPE_OBJECTS.CUSTOMERS, STRIPE_ACTIONS.LIST, {
      limit,
      ...pagination,
    })
      .then((result: { has_more: boolean; data: any }) => {
        return customResponse(true, "Lista cargada successfully", {
          hasMore: result.has_more,
          customers: result.data,
        });
      })
      .catch(() => {
        throw new InternalServerError("Couldn't get the list");
      });
  }

  async getCustomer(id: string) {
    return await this.execute(STRIPE_OBJECTS.CUSTOMERS, STRIPE_ACTIONS.GET, id)
      .then((result: any) => {
        return customResponse(
          true,
          `Customer information ${result.name}  loaded successfully`,
          {
            customer: result,
          }
        );
      })
      .catch((e) => {
        console.log(e);
        throw new InternalServerError("Couldn't get the client");
      });
  }

  async createCustomer(name: string, email: string) {
    const userExisting: { data: Array<any> } = await this.execute(
      STRIPE_OBJECTS.CUSTOMERS,
      STRIPE_ACTIONS.LIST,
      {
        email,
      }
    );

    if (userExisting.data.length > 0) {
      throw new BadRequestError("This user already exists");
    }

    return await this.execute(STRIPE_OBJECTS.CUSTOMERS, STRIPE_ACTIONS.CREATE, {
      name,
      email,
      description: `${name} (${email})`,
    })
      .then(async (result: any) => {
        // Update
        const userCheck = await User.findOne({ email });
        if (!userCheck) {
          throw new BadRequestError("This user doesn't exists");
        }

        userCheck.set({ stripeCustomer: result.id });

        // Save User
        await userCheck.save();

        return customResponse(true, `${name} client has been created`, {
          customer: result,
        });
      })
      .catch(() => {
        throw new InternalServerError("Couldn't create client");
      });
  }

  async updateCustomer(id: string, customer: object) {
    return await this.execute(
      STRIPE_OBJECTS.CUSTOMERS,
      STRIPE_ACTIONS.UPDATE,
      id,
      customer
    )
      .then((result: any) => {
        return customResponse(true, `User ${id} updated`, {
          customer: result,
        });
      })
      .catch(() => {
        throw new InternalServerError("Couldn't create client");
      });
  }

  async deleteCustomer(id: string) {
    return await this.execute(
      STRIPE_OBJECTS.CUSTOMERS,
      STRIPE_ACTIONS.DELETE,
      id
    )
      .then(async (result: { id: string; deleted: boolean }) => {
        if (result.deleted) {
          await User.updateOne(
            { stripeCustomer: result.id },
            { $unset: { stripeCustomer: 1 } }
          );
          return customResponse(true, `User ${id} deleted`, {
            customer: result,
          });
        }
        throw new BadRequestError("Couldn't update user");
      })
      .catch(() => {
        throw new InternalServerError("Couldn't delete client");
      });
  }
}

export default StripeService;
