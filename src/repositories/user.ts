import { PrismaClient } from "@prisma/client";
import { inject, injectable } from "tsyringe";
import { convertToNexusType } from "../common/prismaUtils";
import { NexusGenInputs, NexusGenRootTypes } from "../generated/nexus-typegen";
import { hashPassword } from "../common/bcrypt";
export interface IUserRepository {
  createUser(
    input: NexusGenInputs["RegisterInput"]
  ): Promise<Omit<NexusGenRootTypes["User"], "password">>;
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
}
