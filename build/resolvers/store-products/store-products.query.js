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
const store_product_service_1 = __importDefault(require("../services/store-product.service"));
const store_product_query = {
    Query: {
        storeProducts(_, paginationOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield store_product_service_1.default.getStoreProducts(paginationOptions);
            });
        },
        storeProductsByPlatforms(_, storeProductsPlatformsInput) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield store_product_service_1.default.getStoreProductsByPlatforms(storeProductsPlatformsInput);
            });
        },
        storeProductsOffersLast(_, storeProductsPlatformsInput) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield store_product_service_1.default.getStoreProductsOffersLast(storeProductsPlatformsInput);
            });
        },
        storeProductDetails(_, storeProductsPlatformsInput) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield store_product_service_1.default.storeProductDetails(storeProductsPlatformsInput);
            });
        },
    },
};
exports.default = store_product_query;
