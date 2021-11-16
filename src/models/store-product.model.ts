import { Schema, model, Model } from "mongoose";

// An interface that describes the properties
// that a Genre Document has
interface StoreProductDoc extends Document {
  id: string;
  product_id: string;
  platform_id: string;
  active: boolean;
  price: number;
  stock: number;
}

// An interface that describes the properties
// that a Genre Model has
interface StoreProductModel extends Model<StoreProductDoc> {}

const storeProductSchema = new Schema({
  id: {
    type: Number,
    required: [true, "Name is required"],
    unique: true,
  },
  product_id: {
    type: String,
    required: [true, "Name is required"],
    unique: true,
  },
  platform_id: {
    type: String,
    required: [true, "Name is required"],
    unique: true,
  },
  active: {
    type: Boolean,
  },
  price: {
    type: Number,
  },
  stock: {
    type: Number,
  },
});

const StoreProduct = model<StoreProductDoc, StoreProductModel>(
  "StoreProduct",
  storeProductSchema,
  "products_platforms"
);
export { StoreProduct };
