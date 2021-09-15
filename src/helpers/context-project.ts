import { JWT } from "./jwt";

const contextModel = async ({ req, connection }: any) => {
  const token = req ? req.session.jwt : connection.authorization;
  const currentUser = JWT.verify(token);

  return {
    req,
    token,
    currentUser,
  };
};

export default contextModel;
