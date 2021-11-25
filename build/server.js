"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NODE_ENV = process.env.NODE_ENV;
if (NODE_ENV !== "production") {
    require("dotenv").config({
        path: `.env.${NODE_ENV}`,
    });
}
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const http_1 = require("http");
const apollo_server_express_1 = require("apollo-server-express");
const graphql_playground_middleware_express_1 = __importDefault(require("graphql-playground-middleware-express"));
const schema_1 = __importDefault(require("./schema"));
const database_1 = require("./config/database");
const context_project_1 = __importDefault(require("./helpers/context-project"));
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        app.use((0, compression_1.default)());
        app.use((0, cookie_session_1.default)({
            signed: false,
            secure: false,
        }));
        yield database_1.Database.init();
        const server = new apollo_server_express_1.ApolloServer({
            schema: schema_1.default,
            context: context_project_1.default,
            introspection: true,
        });
        server.applyMiddleware({
            app,
            cors: {
                origin: ["http://localhost:4200", "http://localhost:4500"],
                credentials: true,
            },
        });
        app.use("/", (0, graphql_playground_middleware_express_1.default)({
            endpoint: "/graphql",
        }));
        const httpServer = (0, http_1.createServer)(app);
        server.installSubscriptionHandlers(httpServer);
        const PORT = process.env.PORT;
        httpServer.listen(PORT, () => {
            console.log(`======================SERVER======================`);
            console.log(`API GraphQL  http://localhost:${PORT}/${server.graphqlPath}`);
            console.log(`Subscription  API GraphQL  ws://localhost:${PORT}/${server.graphqlPath}`);
        });
    });
}
init();
