import { Genre } from "../../models/genre.model";

import { BadRequestError } from "../../common/errors/bad-request-error";
import { InternalServerError } from "../../common/errors/internal-server-error";

import { validationInputs } from "../../common/validators/index.validation";
import { customResponse } from "../../common/response/custom-response";
import {
  genreCreateValidation,
  genreDeleteValidation,
  genreGetByIdValidation,
  genreUpdateValidation,
} from "../../common/validators/genre.validators";

import slugify from "slugify";

class GenreService {
  static async addGenre(genreInput: any) {
    // genre create validation
    let value = await validationInputs(genreCreateValidation, genreInput);

    // Check if the genre already exists
    const slug = slugify(value.name, { lower: true });
    const slugCheck = await Genre.findOne({ slug: slug });
    if (slugCheck) {
      throw new BadRequestError("This genre already exists");
    }

    // Set autoincrement Id
    let id;
    const lastElement = await Genre.find().limit(1).sort({ id: -1 });
    lastElement.length === 0
      ? (id = "1")
      : (id = String(+lastElement[0].id + 1));

    const newGenre = {
      id,
      name: value.name,
      slug,
    };

    const genre = new Genre(newGenre);

    // Save genre
    return await genre
      .save()
      .then((genre) => customResponse(true, "Genre created", { genre }))
      .catch((eee) => {
        console.log("the error", eee);
        throw new InternalServerError("Couldn't save the data");
      });
  }

  static async updateGenre(genreInput: any) {
    // genre update validation
    let value = await validationInputs(genreUpdateValidation, genreInput);

    // Check if the genre id already exists
    const genreCheck = await Genre.findOne({ id: value.id });
    if (!genreCheck) {
      throw new BadRequestError("This genre id doesn't exists");
    }

    // Check if the genre name already exists
    const slug = slugify(value.name, { lower: true });
    const slugCheck = await Genre.findOne({ slug: slug });
    if (slugCheck) {
      throw new BadRequestError("This genre name already exists");
    }

    const upatedGenre = {
      name: value.name,
      slug,
    };

    genreCheck.set(upatedGenre);

    // Save genre
    return await genreCheck
      .save()
      .then((genre) => {
        return customResponse(true, "Genre updated", { genre });
      })
      .catch(() => {
        throw new InternalServerError("Couldn't save the data");
      });
  }

  static async deleteGenre(genreInput: any) {
    // genre update validation
    let value = await validationInputs(genreDeleteValidation, genreInput);

    // Check if the genre id already exists
    const genreCheck = await Genre.findOne({ id: value.id });
    if (!genreCheck) {
      throw new BadRequestError("This genre id doesn't exists");
    }

    // Save genre
    return await genreCheck
      .remove()
      .then((genre) => {
        return customResponse(true, "Genre deleted", { genre });
      })
      .catch(() => {
        throw new InternalServerError("Couldn't save the data");
      });
  }

  static async getGenres() {
    try {
      return customResponse(true, "Genres list", {
        genres: await Genre.find(),
      });
    } catch (error) {
      throw new InternalServerError("Couldn't get the data");
    }
  }

  static async getGenre(genreInput: any) {
    // genre update validation
    let value = await validationInputs(genreGetByIdValidation, genreInput);

    // Check if the user exists with that email and remove registerDate from query and User document result
    const existingGenre = await Genre.findOne({ id: value.id });
    if (!existingGenre) {
      throw new BadRequestError("Genre Doesn't exist");
    }
    return customResponse(true, "Genre by ID", {
      genre: existingGenre,
    });
  }
}

export default GenreService;