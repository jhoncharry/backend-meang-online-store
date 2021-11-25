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
const platform_service_1 = __importDefault(require("../services/platform.service"));
const product_service_1 = __importDefault(require("../services/product.service"));
const store_product_service_1 = __importDefault(require("../services/store-product.service"));
const store_product_type = {
    StoreProduct: {
        productId: (parent) => parent.product_id,
        platformId: (parent) => parent.platform_id,
        product: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield product_service_1.default.getProduct(parent.product_id);
            return result.product;
        }),
        platform: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield platform_service_1.default.getPlatform(parent.platform_id);
            return result.platform;
        }),
        relationalProducts: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield store_product_service_1.default.storeRelationalProducts({
                $and: [{ product_id: parent.product_id }, { id: { $ne: parent.id } }],
            });
            return result.platforms;
        }),
    },
};
exports.default = store_product_type;
