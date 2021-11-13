import { BadRequestError } from "../../common/errors/bad-request-error";
import { InternalServerError } from "../../common/errors/internal-server-error";

import { validationInputs } from "../../common/validators/index.validation";
import { customResponse } from "../../common/response/custom-response";

import { pagination } from "../../helpers/pagination";
import { ActiveValues } from "../../models/types/user-active";
import { StoreProduct } from "../../models/store-product.model";
import { platformGetByIdValidation } from "../../common/validators/platform.validators";

class StoreProductService {
  static async getStoreProducts(paginationOptions: any) {
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
        StoreProduct,
        activeFilter
      );
      if (page > paginationData.pages) {
        throw new BadRequestError("No data result");
      }

      const test = await StoreProduct.find(activeFilter)
        .skip(paginationData.skip)
        .limit(paginationData.itemsPage)
        .exec();

      return customResponse(true, "Store Product list", {
        storeProduct: await StoreProduct.find(activeFilter)
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

  static async getStoreProductsByPlatforms(storeProductsPlatformsInput: any) {
    const page = storeProductsPlatformsInput.page || 1;
    const itemsPage = storeProductsPlatformsInput.itemsPage || 20;
    const active = storeProductsPlatformsInput.active || ActiveValues.ACTIVE;
    const platformId = storeProductsPlatformsInput.platform;
    const random = storeProductsPlatformsInput.random || false;

    let filter = {};

    if (active === ActiveValues.ACTIVE) {
      filter = { active: { $ne: false } };
    }
    if (active === ActiveValues.INACTIVE) {
      filter = { active: false };
    }

    // platform  id validation
    let value = await validationInputs(platformGetByIdValidation, {
      id: platformId,
    });

    filter = { ...filter, ...{ platform_id: `${value.id}` } };

    try {
      if (!random) {
        const paginationData = await pagination(
          page,
          itemsPage,
          StoreProduct,
          filter
        );
        if (page > paginationData.pages) {
          throw new BadRequestError("No data result");
        }

        return customResponse(true, "Store Product list", {
          storeProduct: await StoreProduct.find(filter)
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
      }

      const storeProduct = await StoreProduct.aggregate([
        { $match: filter },
        { $sample: { size: itemsPage } },
      ]).exec();

      if (!storeProduct) {
        throw new BadRequestError("No data result from store products");
      }

      return customResponse(true, "Store Product list", {
        storeProduct,
        info: {
          page: 1,
          pages: 1,
          itemsPage,
          total: itemsPage,
        },
      });
    } catch (error) {
      if (error instanceof BadRequestError) return error;
      throw new InternalServerError("Something went wrong...");
    }
  }

  static async getStoreProductsOffersLast(storeProductsPlatformsInput: any) {
    const page = storeProductsPlatformsInput.page || 1;
    const itemsPage = storeProductsPlatformsInput.itemsPage || 20;
    const active = storeProductsPlatformsInput.active || ActiveValues.ACTIVE;
    const topPrice = storeProductsPlatformsInput.topPrice;
    const lastUnits = storeProductsPlatformsInput.lastUnits;
    const random = storeProductsPlatformsInput.random;

    let filter = {};

    if (active === ActiveValues.ACTIVE) {
      filter = { active: { $ne: false } };
    }
    if (active === ActiveValues.INACTIVE) {
      filter = { active: false };
    }

    let otherFilter = {};

    if (lastUnits > 0 && topPrice > 10) {
      otherFilter = {
        $and: [{ price: { $lte: topPrice } }, { stock: { $lte: lastUnits } }],
      };
    } else if (lastUnits <= 0 && topPrice > 10) {
      otherFilter = { price: { $lte: topPrice } };
    } else if (lastUnits > 0 && topPrice <= 10) {
      otherFilter = { stock: { $lte: lastUnits } };
    }

    if (otherFilter !== {}) {
      filter = { ...filter, ...otherFilter };
    }

    try {
      if (!random) {
        const paginationData = await pagination(
          page,
          itemsPage,
          StoreProduct,
          filter
        );
        if (page > paginationData.pages) {
          throw new BadRequestError("No data result");
        }

        return customResponse(true, "Store Product list", {
          storeProduct: await StoreProduct.find(filter)
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
      }

      const storeProduct = await StoreProduct.aggregate([
        { $match: filter },
        { $sample: { size: itemsPage } },
      ]).exec();

      if (!storeProduct) {
        throw new BadRequestError("No data result from store products");
      }

      return customResponse(true, "Store Product list", {
        storeProduct,
        info: {
          page: 1,
          pages: 1,
          itemsPage,
          total: itemsPage,
        },
      });
    } catch (error) {
      if (error instanceof BadRequestError) return error;
      throw new InternalServerError("Something went wrong...");
    }
  }
}

export default StoreProductService;
