import { BadRequestError } from "../../common/errors/bad-request-error";

import { customResponse } from "../../common/response/custom-response";

import { Product } from "../../models/product.model";

class ProductService {
  static async getProduct(id: any) {
    // Check if the user exists with that email and remove registerDate from query and User document result
    const existingProduct = await Product.findOne({ id });
    if (!existingProduct) {
      throw new BadRequestError("Product Doesn't exist");
    }
    return customResponse(true, "Product by ID", {
      product: existingProduct,
    });
  }
}

export default ProductService;
