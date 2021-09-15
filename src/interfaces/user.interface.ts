import { ObjectId } from "mongoose";

export interface IUser {
  _id: ObjectId;
  name: string;
  lastname: string;
  email: string;
  password: string;
  registerDate: string;
  birthday: string;
  role: string;
}
