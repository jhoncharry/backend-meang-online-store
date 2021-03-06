const NODE_ENV = process.env.NODE_ENV;

if (NODE_ENV !== "production") {
  require("dotenv").config({
    path: `.env.${NODE_ENV}`,
  });
}

import express from "express";
import cors from "cors";
import compression from "compression";
import cookieSession from "cookie-session";

import { createServer } from "http";
import { ApolloServer } from "apollo-server-express";
import expressPlayGround from "graphql-playground-middleware-express";

import schema from "./schema";
import { Database } from "./config/database";
import contextModel from "./helpers/context-project";

// Start function
async function init() {
  const app = express();
  app.set("trust proxy", true);

  // CORS config
  // app.use(cors());

  // Compression - Optimize request performance
  app.use(compression());

  app.use(
    cookieSession({
      signed: false,
      // secure: process.env.NODE_ENV !== "test"  // ONLY FOR DEV ENVIRONMENT OR HTTPS CONNECTION (CHECK IF IT'S WORKING IN HTTPS CONNECTIONS)
      secure: process.env.NODE_ENV !== ("development" || "test"), // IN ORDER TO DISABLE HTTPS checking, CASUE I HAVE ONLY HTTP AT THE MOMENT AND COOKIES WORKS WITH HTTPS
      sameSite:
        process.env.NODE_ENV !== ("development" || "test") ? "none" : "lax",
    })
  );

  // Base de datos
  await Database.init();

  // APOLLO SERVER
  const server = new ApolloServer({
    schema,
    context: contextModel,
    introspection: true,
    playground: true,
  });

  server.applyMiddleware({
    app,
    cors: {
      origin: [process.env.CLIENT_PUBLIC!, process.env.CLIENT_ADMIN!],
      credentials: true,
    },
  });

  app.use(
    "/",
    expressPlayGround({
      endpoint: "/graphql",
    })
  );

  const httpServer = createServer(app);
  server.installSubscriptionHandlers(httpServer);

  const PORT = process.env.PORT;
  httpServer.listen(PORT, () => {
    console.log(`======================SERVER======================`);
    console.log(`API GraphQL  http://localhost:${PORT}/${server.graphqlPath}`);
    console.log(
      `Subscription  API GraphQL  ws://localhost:${PORT}/${server.graphqlPath}`
    );
  });
}

init();
