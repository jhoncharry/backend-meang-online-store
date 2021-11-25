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
const custom_response_1 = require("../../common/response/custom-response");
const product_model_1 = require("../../models/product.model");
class ProductService {
    static getProduct(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingProduct = yield product_model_1.Product.findOne({ id });
            if (!existingProduct) {
                throw new bad_request_error_1.BadRequestError("Product Doesn't exist");
            }
            return (0, custom_response_1.customResponse)(true, "Product by ID", {
                product: existingProduct,
            });
        });
    }
}
exports.default = ProductService;
