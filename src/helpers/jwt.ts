import jwt from "jsonwebtoken";
import { ObjectId } from "mongoose";

import { InternalServerError } from "../common/errors/internal-server-error";
import { IJwt } from "../interfaces/jwt.interface";

interface UserPayload {
  user: {
    _id: ObjectId;
    name: string;
    lastname: string;
    email: string;
    role: string;
  };
}

export class JWT {
  private static secretKey = process.env.TOKEN_SECRET as string;

  static sign(data: IJwt): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(
        { user: data.user },
        this.secretKey,
        {
          expiresIn: "1h",
        },
        (error, token) => {
          if (error) {
            reject(new InternalServerError("Failed to generate access token"));
          } else {
            resolve(token!);
          }
        }
      );
    });
  }

  static verify(token: string) {
    try {
      const { user } = jwt.verify(token, this.secretKey) as UserPayload;
      return user;
    } catch (error) {
      return null;
    }
  }
}
