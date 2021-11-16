import { IResolvers } from "@graphql-tools/utils";

import StoreProductService from "../services/store-product.service";

const store_product_query: IResolvers = {
  Query: {
    // Get store products
    async storeProducts(_, paginationOptions) {
      return await StoreProductService.getStoreProducts(paginationOptions);
    },

    // Get store products
    async storeProductsByPlatforms(_, storeProductsPlatformsInput) {
      return await StoreProductService.getStoreProductsByPlatforms(
        storeProductsPlatformsInput
      );
    },

    // Get store products
    async storeProductsOffersLast(_, storeProductsPlatformsInput) {
      return await StoreProductService.getStoreProductsOffersLast(
        storeProductsPlatformsInput
      );
    },

    // Get store products
    async storeProductDetails(_, storeProductsPlatformsInput) {
      return await StoreProductService.storeProductDetails(
        storeProductsPlatformsInput
      );
    },

    // Get genre by id
    /*     async genre(_, genreInput) {
      return await GenreService.getGenre(genreInput);
    }, */
  },
};

export default store_product_query;
