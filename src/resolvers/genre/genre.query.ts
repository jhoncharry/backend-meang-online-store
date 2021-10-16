import { IResolvers } from "@graphql-tools/utils";

import GenreService from "../services/genre.service";

const genre_query: IResolvers = {
  Query: {
    // Get genres
    async genres(_, __) {
      return await GenreService.getGenres();
    },

    // Get genre by id
    async genre(_, genreInput) {
      return await GenreService.getGenre(genreInput);
    },
  },
};

export default genre_query;
