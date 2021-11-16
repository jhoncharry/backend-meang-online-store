import { IResolvers } from "@graphql-tools/utils";

import PlatformService from "../services/platform.service";
import ProductService from "../services/product.service";
import StoreProductService from "../services/store-product.service";

const store_product_type: IResolvers = {
  StoreProduct: {
    productId: (parent) => parent.product_id,
    platformId: (parent) => parent.platform_id,
    product: async (parent) => {
      const result = await ProductService.getProduct(parent.product_id);
      return result.product;
    },
    platform: async (parent) => {
      const result = await PlatformService.getPlatform(parent.platform_id);
      return result.platform;
    },
    relationalProducts: async (parent) => {
      const result = await StoreProductService.storeRelationalProducts({
        $and: [{ product_id: parent.product_id }, { id: { $ne: parent.id } }],
      });
      return result.platforms;
    },
  },
};

export default store_product_type;
