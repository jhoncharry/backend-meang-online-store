import { Schema, Model, Document, model } from "mongoose";
import { UserRoles } from "./types/user-roles";

import bcrypt from "bcrypt";

// An interface that describes the properties
// that are requried to create a new User
interface UserAttrs {
  name: string;
  lastname: string;
  email: string;
  password: string;
  birthday: string;
  role: UserRoles;
}

// An interface that describes the properties
// that a User Document has
interface UserDoc extends Document {
  name: string;
  lastname: string;
  email: string;
  password: string;
  registerDate: string;
  birthday: string;
  role: UserRoles;
  comparePassword(password: string): Promise<Boolean>;
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

const validRoles = {
  values: Object.values(UserRoles),
  message: "{VALUE} is not a valid role",
};

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    lastname: {
      type: String,
      required: [true, "Lastname is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      hide: true,
    },
    registerDate: {
      type: String,
      required: [true, "Register date is required"],
    },
    birthday: {
      type: String,
      required: [true, "Birthday is required"],
    },
    role: {
      type: String,
      enum: validRoles,
      default: "CLIENT",
      required: [true, "Role is required"],
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(this.get("password"), salt);
    this.set("password", hashed);
  }
  done();
});

userSchema.methods.comparePassword = async function (
  password: string
): Promise<Boolean> {
  return await bcrypt.compare(password, this.get("password"));
};

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = model<UserDoc, UserModel>("User", userSchema);

export { User };
