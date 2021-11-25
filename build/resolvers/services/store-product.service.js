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
Object.defineProperty(exports, "__esModule", { value: true });
const bad_request_error_1 = require("../../common/errors/bad-request-error");
const internal_server_error_1 = require("../../common/errors/internal-server-error");
const index_validation_1 = require("../../common/validators/index.validation");
const custom_response_1 = require("../../common/response/custom-response");
const pagination_1 = require("../../helpers/pagination");
const user_active_1 = require("../../models/types/user-active");
const store_product_model_1 = require("../../models/store-product.model");
const platform_validators_1 = require("../../common/validators/platform.validators");
const storeProduct_validators_1 = require("../../common/validators/storeProduct.validators");
const constants_1 = require("../../config/constants");
class StoreProductService {
    static getStoreProducts(paginationOptions) {
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
                const paginationData = yield (0, pagination_1.pagination)(page, itemsPage, store_product_model_1.StoreProduct, activeFilter);
                if (page > paginationData.pages) {
                    throw new bad_request_error_1.BadRequestError("No data result");
                }
                const test = yield store_product_model_1.StoreProduct.find(activeFilter)
                    .skip(paginationData.skip)
                    .limit(paginationData.itemsPage)
                    .exec();
                return (0, custom_response_1.customResponse)(true, "Store Product list", {
                    storeProduct: yield store_product_model_1.StoreProduct.find(activeFilter)
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
    static getStoreProductsByPlatforms(storeProductsPlatformsInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = storeProductsPlatformsInput.page || 1;
            const itemsPage = storeProductsPlatformsInput.itemsPage || 20;
            const active = storeProductsPlatformsInput.active || user_active_1.ActiveValues.ACTIVE;
            const platformId = storeProductsPlatformsInput.platform;
            const random = storeProductsPlatformsInput.random || false;
            let filter = {};
            if (active === user_active_1.ActiveValues.ACTIVE) {
                filter = { active: { $ne: false } };
            }
            if (active === user_active_1.ActiveValues.INACTIVE) {
                filter = { active: false };
            }
            let value = yield (0, index_validation_1.validationInputs)(platform_validators_1.platformGetByMultipleIdsValidation, {
                id: platformId,
            });
            const ids = value.id;
            const platforms = ids.map(String);
            filter = Object.assign(Object.assign({}, filter), { platform_id: { $in: platforms } });
            try {
                if (!random) {
                    const paginationData = yield (0, pagination_1.pagination)(page, itemsPage, store_product_model_1.StoreProduct, filter);
                    if (page > paginationData.pages) {
                        throw new bad_request_error_1.BadRequestError("No data result");
                    }
                    return (0, custom_response_1.customResponse)(true, "Store Product list", {
                        storeProduct: yield store_product_model_1.StoreProduct.find(filter)
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
                const storeProduct = yield store_product_model_1.StoreProduct.aggregate([
                    { $match: filter },
                    { $sample: { size: itemsPage } },
                ]).exec();
                if (!storeProduct) {
                    throw new bad_request_error_1.BadRequestError("No data result from store products");
                }
                return (0, custom_response_1.customResponse)(true, "Store Product list", {
                    storeProduct,
                    info: {
                        page: 1,
                        pages: 1,
                        itemsPage,
                        total: itemsPage,
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
    static getStoreProductsOffersLast(storeProductsPlatformsInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = storeProductsPlatformsInput.page || 1;
            const itemsPage = storeProductsPlatformsInput.itemsPage || 20;
            const active = storeProductsPlatformsInput.active || user_active_1.ActiveValues.ACTIVE;
            const topPrice = storeProductsPlatformsInput.topPrice;
            const lastUnits = storeProductsPlatformsInput.lastUnits;
            const random = storeProductsPlatformsInput.random;
            let filter = {};
            if (active === user_active_1.ActiveValues.ACTIVE) {
                filter = { active: { $ne: false } };
            }
            if (active === user_active_1.ActiveValues.INACTIVE) {
                filter = { active: false };
            }
            let otherFilter = {};
            if (lastUnits > 0 && topPrice > 10) {
                otherFilter = {
                    $and: [{ price: { $lte: topPrice } }, { stock: { $lte: lastUnits } }],
                };
            }
            else if (lastUnits <= 0 && topPrice > 10) {
                otherFilter = { price: { $lte: topPrice } };
            }
            else if (lastUnits > 0 && topPrice <= 10) {
                otherFilter = { stock: { $lte: lastUnits } };
            }
            if (otherFilter !== {}) {
                filter = Object.assign(Object.assign({}, filter), otherFilter);
            }
            try {
                if (!random) {
                    const paginationData = yield (0, pagination_1.pagination)(page, itemsPage, store_product_model_1.StoreProduct, filter);
                    if (page > paginationData.pages) {
                        throw new bad_request_error_1.BadRequestError("No data result");
                    }
                    return (0, custom_response_1.customResponse)(true, "Store Product list", {
                        storeProduct: yield store_product_model_1.StoreProduct.find(filter)
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
                const storeProduct = yield store_product_model_1.StoreProduct.aggregate([
                    { $match: filter },
                    { $sample: { size: itemsPage } },
                ]).exec();
                if (!storeProduct) {
                    throw new bad_request_error_1.BadRequestError("No data result from store products");
                }
                return (0, custom_response_1.customResponse)(true, "Store Product list", {
                    storeProduct,
                    info: {
                        page: 1,
                        pages: 1,
                        itemsPage,
                        total: itemsPage,
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
    static storeProductDetails(storeProductsPlatformsInput) {
        return __awaiter(this, void 0, void 0, function* () {
            let value = yield (0, index_validation_1.validationInputs)(storeProduct_validators_1.storeProductGetByIdValidation, storeProductsPlatformsInput);
            const existingStoreProduct = yield store_product_model_1.StoreProduct.findOne({ id: value.id });
            if (!existingStoreProduct) {
                throw new bad_request_error_1.BadRequestError("Genre Doesn't exist");
            }
            return (0, custom_response_1.customResponse)(true, "Genre by ID", {
                storeProduct: existingStoreProduct,
            });
        });
    }
    static storeRelationalProducts(filter = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingPlatforms = yield store_product_model_1.StoreProduct.find(filter);
            if (!existingPlatforms) {
                throw new bad_request_error_1.BadRequestError("Store Products Don't exist");
            }
            return (0, custom_response_1.customResponse)(true, "Store Products by ID", {
                platforms: existingPlatforms,
            });
        });
    }
    static updateStock(updateList, pubsub) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                updateList.map((item) => __awaiter(this, void 0, void 0, function* () {
                    const itemDetails = yield store_product_model_1.StoreProduct.findOne({ id: +item.id });
                    if (item.increment < 0 && item.increment + itemDetails.stock < 0) {
                        item.increment = -itemDetails.stock;
                    }
                    yield this.manageStockUpdate({ id: +item.id }, { stock: item.increment });
                    itemDetails.stock += item.increment;
                    pubsub.publish(constants_1.SUBSCRIPTIONS_EVENT.UPDATE_STOCK_PRODUCT, {
                        selectProductStockUpdate: itemDetails,
                    });
                }));
                return true;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    static manageStockUpdate(filter, updateObject) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield store_product_model_1.StoreProduct.updateOne(filter, { $inc: updateObject });
        });
    }
}
exports.default = StoreProductService;
