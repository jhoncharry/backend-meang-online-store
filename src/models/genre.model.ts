import { Schema, model, Model } from "mongoose";

// An interface that describes the properties
// that a Genre Document has
interface GenreDoc extends Document {
  id: string;
  name: string;
  slug: string;
}

// An interface that describes the properties
// that a Genre Model has
interface GenreModel extends Model<GenreDoc> {}

const genreSchema = new Schema({
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

const Genre = model<GenreDoc, GenreModel>("Genre", genreSchema);
export { Genre };
