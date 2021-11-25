"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const genre_model_1 = require("../../models/genre.model");
const bad_request_error_1 = require("../../common/errors/bad-request-error");
const internal_server_error_1 = require("../../common/errors/internal-server-error");
const index_validation_1 = require("../../common/validators/index.validation");
const custom_response_1 = require("../../common/response/custom-response");
const genre_validators_1 = require("../../common/validators/genre.validators");
const slugify_1 = __importDefault(require("slugify"));
const pagination_1 = require("../../helpers/pagination");
const user_active_1 = require("../../models/types/user-active");
class GenreService {
    static addGenre(genreInput) {
        return __awaiter(this, void 0, void 0, function* () {
            let value = yield (0, index_validation_1.validationInputs)(genre_validators_1.genreCreateValidation, genreInput);
            const slug = (0, slugify_1.default)(value.name, { lower: true });
            const slugCheck = yield genre_model_1.Genre.findOne({ slug: slug });
            if (slugCheck) {
                throw new bad_request_error_1.BadRequestError("This genre already exists");
            }
            let id;
            const lastElement = yield genre_model_1.Genre.find()
                .limit(1)
                .sort({ id: -1 })
                .collation({ locale: "en_US", numericOrdering: true });
            lastElement.length === 0
                ? (id = "1")
                : (id = String(+lastElement[0].id + 1));
            const newGenre = {
                id,
                name: value.name,
                slug,
                active: false,
            };
            const genre = new genre_model_1.Genre(newGenre);
            return yield genre
                .save()
                .then((genre) => (0, custom_response_1.customResponse)(true, "Genre created", { genre }))
                .catch((error) => {
                console.log("The error", error);
                throw new internal_server_error_1.InternalServerError("Couldn't save the data");
            });
        });
    }
    static updateGenre(genreInput) {
        return __awaiter(this, void 0, void 0, function* () {
            let value = yield (0, index_validation_1.validationInputs)(genre_validators_1.genreUpdateValidation, genreInput);
            const genreCheck = yield genre_model_1.Genre.findOne({ id: value.id });
            if (!genreCheck) {
                throw new bad_request_error_1.BadRequestError("This genre id doesn't exists");
            }
            const slug = (0, slugify_1.default)(value.name, { lower: true });
            const slugCheck = yield genre_model_1.Genre.findOne({ slug: slug });
            if (slugCheck) {
                throw new bad_request_error_1.BadRequestError("This genre name already exists");
            }
            const upatedGenre = {
                name: value.name,
                slug,
            };
            genreCheck.set(upatedGenre);
            return yield genreCheck
                .save()
                .then((genre) => {
                return (0, custom_response_1.customResponse)(true, "Genre updated", { genre });
            })
                .catch(() => {
                throw new internal_server_error_1.InternalServerError("Couldn't save the data");
            });
        });
    }
    static deleteGenre(genreInput) {
        return __awaiter(this, void 0, void 0, function* () {
            let value = yield (0, index_validation_1.validationInputs)(genre_validators_1.genreDeleteValidation, genreInput);
            const genreCheck = yield genre_model_1.Genre.findOne({ id: value.id });
            if (!genreCheck) {
                throw new bad_request_error_1.BadRequestError("This genre id doesn't exists");
            }
            return yield genreCheck
                .remove()
                .then((genre) => {
                return (0, custom_response_1.customResponse)(true, "Genre deleted", { genre });
            })
                .catch(() => {
                throw new internal_server_error_1.InternalServerError("Couldn't save the data");
            });
        });
    }
    static unblockGenre(genreInput) {
        return __awaiter(this, void 0, void 0, function* () {
            let value = yield (0, index_validation_1.validationInputs)(genre_validators_1.genreUnblockValidation, genreInput);
            const genreCheck = yield genre_model_1.Genre.findOne({ id: value.id });
            if (!genreCheck) {
                throw new bad_request_error_1.BadRequestError("This genre id doesn't exists");
            }
            genreCheck.set({ active: value.unblock });
            const action = value.unblock ? "Unblocked" : "Blocked";
            return yield genreCheck
                .save()
                .then((genre) => {
                return (0, custom_response_1.customResponse)(true, `Genre ${action}`, { genre });
            })
                .catch(() => {
                throw new internal_server_error_1.InternalServerError("Couldn't block the genre");
            });
        });
    }
    static getGenres(paginationOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = paginationOptions.page || 1;
            const itemsPage = paginationOptions.itemsPage || 20;
            const active = paginationOptions.active || user_active_1.ActiveValues.ACTIVE;
            let activeFilter = {};
            if (active === user_active_1.ActiveValues.ACTIVE) {
                activeFilter = { active: { $ne: false } };
            }
            if (active === user_active_1.ActiveValues.INACTIVE) {
                activeFilter = { active: false };
            }
            try {
                const paginationData = yield (0, pagination_1.pagination)(page, itemsPage, genre_model_1.Genre, activeFilter);
                if (page > paginationData.pages) {
                    throw new bad_request_error_1.BadRequestError("No data result");
                }
                return (0, custom_response_1.customResponse)(true, "Genres list", {
                    genres: yield genre_model_1.Genre.find(activeFilter)
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
            catch (error) {
                if (error instanceof bad_request_error_1.BadRequestError)
                    return error;
                throw new internal_server_error_1.InternalServerError("Something went wrong...");
            }
        });
    }
    static getGenre(genreInput) {
        return __awaiter(this, void 0, void 0, function* () {
            let value = yield (0, index_validation_1.validationInputs)(genre_validators_1.genreGetByIdValidation, genreInput);
            const existingGenre = yield genre_model_1.Genre.findOne({ id: value.id });
            if (!existingGenre) {
                throw new bad_request_error_1.BadRequestError("Genre Doesn't exist");
            }
            return (0, custom_response_1.customResponse)(true, "Genre by ID", {
                genre: existingGenre,
            });
        });
    }
}
exports.default = GenreService;
