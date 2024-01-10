import { User } from "@prisma/client";
import { AuthenticationError, ExpressContext } from "apollo-server-express";
import { verify } from "jsonwebtoken";
import { config } from "./config/enviroment";

const nonAuthenticatedMutations = ["Login", "Register"];

export type Context = {
  user?: Omit<User, "password">;
};

export const context =
  () =>
  async ({ req }: ExpressContext): Promise<Context> => {
    if (
      req.body &&
      nonAuthenticatedMutations.includes(req.body.operationName)
    ) {
      return {};
    }

    if (
      req.headers.authorization === undefined ||
      req.headers.authorization.split(" ")[0] !== "Bearer"
    ) {
      throw new AuthenticationError("Need token");
    }

    const token = req.headers.authorization.split(" ")[1];
    if (!token) throw new AuthenticationError("Need token");
    let decodedToken: Omit<User, "password">;
    try {
      decodedToken = verify(token, config.JWT_TOKEN) as User;
    } catch (e) {
      if (e instanceof Error) throw new AuthenticationError(e.name + e.message);
      throw e;
    }
    return {
      user: decodedToken,
    };
  };
