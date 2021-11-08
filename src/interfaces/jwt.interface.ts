import { ObjectId } from "mongoose";

export interface UserPayload {
  user: {
    _id: ObjectId;
    name?: string;
    lastname?: string;
    email: string;
    role?: string;
  };
}
