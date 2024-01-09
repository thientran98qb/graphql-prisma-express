import { ApolloServer } from "@apollo/server";
import { PrismaClient } from "@prisma/client";
import express from "express";
import http from "http";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import cors from "cors";
import "reflect-metadata";
import bodyParser from "body-parser";
import { schema } from "./schema";
import { setContainerInjection } from "./tsyringe.config";

const app = express();
const httpServer = http.createServer(app);
export const prisma = new PrismaClient();

async function main() {
  await setContainerInjection();

  const server = new ApolloServer({
    schema: schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    cache: "bounded",
  });

  const port = 3003;

  await server.start();

  app.use(cors(), bodyParser.json(), expressMiddleware(server));

  httpServer.listen({ port }, () => {
    console.log(`🚀 Server is ready at http://127.0.0.1:${port}`);
  });
}

main()
  .then(async () => {
    await prisma.$connect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
