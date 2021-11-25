const path = require("path");

import { makeExecutableSchema } from "@graphql-tools/schema";
import { GraphQLSchema } from "graphql";

import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import { loadFilesSync } from "@graphql-tools/load-files";

const resolversArray = loadFilesSync(
  path.join(__dirname, "../resolvers/**/*.{ts,js}")
);

const resolvers = mergeResolvers(resolversArray);

const typeDefs = mergeTypeDefs(loadFilesSync(`${__dirname}/**/*.graphql`));

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default schema;
