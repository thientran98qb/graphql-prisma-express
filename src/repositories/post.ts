import { PrismaClient } from "@prisma/client";
import { inject, injectable } from "tsyringe";
import { convertToNexusType } from "../common/prismaUtils";
import { NexusGenInputs, NexusGenRootTypes } from "../generated/nexus-typegen";
export interface IPostRepository {
  delete(id: number): Promise<NexusGenRootTypes["Post"]>;
  create(
    input: NexusGenInputs["CreatePostInput"]
  ): Promise<NexusGenRootTypes["Post"]>;
  update(
    input: NexusGenInputs["UpdatePostInput"]
  ): Promise<NexusGenRootTypes["Post"]>;
}

@injectable()
export default class PostRepository implements IPostRepository {
  constructor(@inject("PrismaClient") private readonly prisma: PrismaClient) {}
  async delete(id: number): Promise<NexusGenRootTypes["Post"]> {
    const res = await this.prisma.post.delete({
      where: { id },
    });

    return convertToNexusType.Post(res);
  }

  async create(
    input: NexusGenInputs["CreatePostInput"]
  ): Promise<NexusGenRootTypes["Post"]> {
    const res = await this.prisma.post.create({
      data: input,
    });

    return convertToNexusType.Post(res);
  }

  async update(
    input: NexusGenInputs["UpdatePostInput"]
  ): Promise<NexusGenRootTypes["Post"]> {
    const { id, ...dataInput } = input;
    const res = await this.prisma.post.update({
      where: { id },
      data: dataInput,
    });

    return convertToNexusType.Post(res);
  }
}
