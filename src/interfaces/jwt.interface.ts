import { ObjectId } from "mongoose";

export interface IJwt {
  user: {
    _id: ObjectId;
    name: string;
    lastname: string;
    email: string;
    birthday: string;
    role: string;
  };
}
