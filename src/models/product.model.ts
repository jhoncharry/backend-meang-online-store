import { Schema, model, Model } from "mongoose";

// An interface that describes the properties
// that a Genre Document has
interface ProductDoc extends Document {
  id: string;
  name: string;
  slug: string;
  released: string;
  img: string;
}

// An interface that describes the properties
// that a Genre Model has
interface ProductModel extends Model<ProductDoc> {}

const productSchema = new Schema({
  id: {
    type: String,
    required: [true, "Name is required"],
    unique: true,
  },
  name: {
    type: String,
    required: [true, "Lastname is required"],
    unique: true,
  },
  slug: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  released: {
    type: String,
    required: [true, "Email is required"],
  },
  img: {
    type: String,
    required: [true, "Email is required"],
  },
  clip: {
    type: Object,
  },
  rating: {
    type: Object,
  },
  shortScreenshots: {
    type: Object,
  },
});

const Product = model<ProductDoc, ProductModel>("Product", productSchema);
export { Product };
