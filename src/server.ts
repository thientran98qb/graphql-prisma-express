import { ApolloServer } from "apollo-server-express";
import { PrismaClient } from "@prisma/client";
import express from "express";
import cors from "cors";
import "reflect-metadata";
import bodyParser from "body-parser";
import { schema } from "./schema";
import { setContainerInjection } from "./tsyringe.config";
import { context } from "./context";

const app = express();
export const prisma = new PrismaClient();

async function main() {
  await setContainerInjection();

  const server = new ApolloServer({
    schema: schema,
    context: context(),
    plugins: [],
    cache: "bounded",
  });

  const port = 3003;

  app.use(cors(), bodyParser.json(), express.json());
  app.use(express.urlencoded({ extended: true }));

  await server.start();

  server.applyMiddleware({ app });

  console.log(`NODE_ENV:${process.env.NODE_ENV}`);
  console.log(
    `🚀 Server ready at http://127.0.0.1:${port}${server.graphqlPath}`
  );

  return app.listen(port);
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
