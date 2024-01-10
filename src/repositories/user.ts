import { PrismaClient, User } from "@prisma/client";
import { inject, injectable } from "tsyringe";
import { convertToNexusType } from "../common/prismaUtils";
import { NexusGenInputs, NexusGenRootTypes } from "../generated/nexus-typegen";
import { comparePassword, hashPassword } from "../common/bcrypt";
import { AuthenticationError } from "apollo-server-errors";
import { sign } from "jsonwebtoken";
import { config } from "../config/enviroment";
export interface IUserRepository {
  createUser(
    input: NexusGenInputs["RegisterInput"]
  ): Promise<Omit<NexusGenRootTypes["User"], "password">>;

  loginUser(
    input: NexusGenInputs["LoginInput"]
  ): Promise<NexusGenRootTypes["Auth"]>;
}

@injectable()
export default class UserRepository implements IUserRepository {
  constructor(@inject("PrismaClient") private readonly prisma: PrismaClient) {}
  async createUser(
    input: NexusGenInputs["RegisterInput"]
  ): Promise<Omit<NexusGenRootTypes["User"], "password">> {
    const passwordHash = await hashPassword(input.password);

    const res = await this.prisma.user.create({
      data: {
        ...input,
        password: passwordHash,
      },
    });

    return res && convertToNexusType.User(res);
  }

  async loginUser(
    input: NexusGenInputs["LoginInput"]
  ): Promise<NexusGenRootTypes["Auth"]> {
    const findUser = await this.prisma.user.findFirst({
      where: {
        email: input.email,
      },
    });
    if (!findUser) {
      throw new AuthenticationError("User is not exist in system!");
    }

    if (!(await comparePassword(input.password, findUser.password))) {
      throw new AuthenticationError("Password is wrong !");
    }

    return this.getUserToken(findUser);
  }

  private getUserToken = (user: User) => {
    const accessToken = sign(
      {
        user_id: user.id,
        email: user.email,
      },
      config.JWT_TOKEN
    );

    return {
      accessToken,
      user: convertToNexusType.User(user),
    };
  };
}
