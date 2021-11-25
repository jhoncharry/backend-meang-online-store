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
const genre_service_1 = __importDefault(require("../services/genre.service"));
const genre_mutation = {
    Mutation: {
        addGenre(_, genreInput) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield genre_service_1.default.addGenre(genreInput);
            });
        },
        updateGenre(_, genreInput) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield genre_service_1.default.updateGenre(genreInput);
            });
        },
        deleteGenre(_, genreInput) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield genre_service_1.default.deleteGenre(genreInput);
            });
        },
        unblockGenre(_, genreInput) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield genre_service_1.default.unblockGenre(genreInput);
            });
        },
    },
};
exports.default = genre_mutation;
