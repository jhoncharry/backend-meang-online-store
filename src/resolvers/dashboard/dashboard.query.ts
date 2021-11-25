import { IResolvers } from "@graphql-tools/utils";
import mongoose from "mongoose";

let connection = mongoose.connection;

const dashboard_query: IResolvers = {
  Query: {
    // Get dashboard
    async totalElements(_, { collection }) {
      return await connection.collection(collection).countDocuments();
    },
  },
};

export default dashboard_query;
