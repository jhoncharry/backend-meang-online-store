import { User } from "../models/user.model";
import { JWT } from "./jwt";

const contextModel = async ({ req, connection }: any) => {
  const token = req ? req.session.jwt : connection.authorization;
  const currentUser = JWT.verify(token);

  return {
    req,
    currentUser: await getCurrentUser(currentUser),
  };
};

const getCurrentUser = async (currentUser: any) => {
  if (currentUser) {
    return await User.findById(currentUser._id)
      .select("-registerDate -birthday")
      .then((currentUser) => currentUser)
      .catch(() => null);
  }
};

export default contextModel;
