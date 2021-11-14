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

  // CORS config
  // app.use(cors());

  // Compression - Optimize request performance
  app.use(compression());

  app.use(
    cookieSession({
      signed: false,
      // secure: process.env.NODE_ENV !== "test"  // ONLY FOR DEV ENVIRONMENT OR HTTPS CONNECTION (CHECK IF IT'S WORKING IN HTTPS CONNECTIONS)
      secure: false, // IN ORDER TO DISABLE HTTPS checking, CASUE I HAVE ONLY HTTP AT THE MOMENT AND COOKIES WORKS WITH HTTPS
    })
  );

  // Base de datos
  await Database.init();

  // APOLLO SERVER
  const server = new ApolloServer({
    schema,
    context: contextModel,
    introspection: true,
    debug: false,
  });
  await server.start();
  server.applyMiddleware({
    app,
    cors: { origin: ["http://localhost:4200", "http://localhost:4500"], credentials: true },
  });

  app.get(
    "/",
    expressPlayGround({
      endpoint: "/graphql",
    })
  );

  const PORT = process.env.PORT;
  const httpServer = createServer(app);
  httpServer.listen(PORT, () => {
    console.log("======================SERVER======================");
    console.log(`http://localhost:${PORT} API MEANG - Online Store`);
  });
}

init();
