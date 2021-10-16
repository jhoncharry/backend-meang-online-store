import { IResolvers } from "@graphql-tools/utils";

import GenreService from "../services/genre.service";

const genre_mutation: IResolvers = {
  Mutation: {
    // Genre register
    async addGenre(_, genreInput) {
      return await GenreService.addGenre(genreInput);
    },
    async updateGenre(_, genreInput) {
      return await GenreService.updateGenre(genreInput);
    },
    async deleteGenre(_, genreInput) {
      return await GenreService.deleteGenre(genreInput);
    },
  },
};

export default genre_mutation;
