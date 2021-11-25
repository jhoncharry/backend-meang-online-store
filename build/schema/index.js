"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const schema_1 = require("@graphql-tools/schema");
const merge_1 = require("@graphql-tools/merge");
const load_files_1 = require("@graphql-tools/load-files");
const resolversArray = (0, load_files_1.loadFilesSync)(path.join(__dirname, "../resolvers/**/*.{ts,js}"));
const resolvers = (0, merge_1.mergeResolvers)(resolversArray);
const typeDefs = (0, merge_1.mergeTypeDefs)((0, load_files_1.loadFilesSync)(`${__dirname}/**/*.graphql`));
const schema = (0, schema_1.makeExecutableSchema)({
    typeDefs,
    resolvers,
});
exports.default = schema;
