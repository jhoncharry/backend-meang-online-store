import { IResolvers } from "@graphql-tools/utils";

import StoreProductService from "../services/store-product.service";

const store_product_mutation: IResolvers = {
  Mutation: {
    // Update stock
    async updateStock(_, { update }, { pubsub }) {
      return await StoreProductService.updateStock(update, pubsub);
    },

    // Get genre by id
    /*     async genre(_, genreInput) {
      return await GenreService.getGenre(genreInput);
    }, */
  },
};

export default store_product_mutation;
