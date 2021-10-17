import { IResolvers } from "@graphql-tools/utils";
import { pagination } from "../../helpers/pagination";
import { Genre } from "../../models/genre.model";

import GenreService from "../services/genre.service";

const genre_query: IResolvers = {
  Query: {
    // Get genres
    async genres(_, paginationOptions) {
      return await GenreService.getGenres(paginationOptions);
    },

    // Get genre by id
    async genre(_, genreInput) {
      return await GenreService.getGenre(genreInput);
    },
  },
};

export default genre_query;
