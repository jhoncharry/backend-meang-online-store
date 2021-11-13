import { Schema, model, Model } from "mongoose";

// An interface that describes the properties
// that a Genre Document has
interface PlatformDoc extends Document {
  id: string;
  name: string;
  slug: string;
  active: boolean;
}

// An interface that describes the properties
// that a Genre Model has
interface PlatformModel extends Model<PlatformDoc> {}

const platformSchema = new Schema({
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
  active: {
    type: Boolean,
  },
});

const Platform = model<PlatformDoc, PlatformModel>("Platform", platformSchema);
export { Platform };
