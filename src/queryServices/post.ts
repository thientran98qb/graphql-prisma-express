import { PrismaClient } from "@prisma/client";
import { inject, injectable } from "tsyringe";
import { NexusGenRootTypes } from "../generated/nexus-typegen";
import { convertToNexusType } from "../common/prismaUtils";
import { findManyCursorConnection } from "@devoxa/prisma-relay-cursor-connection";

type ReqFindConnection = {
  after?: string | null;
  before?: string | null;
  first?: number | null;
  last?: number | null;
};

export interface IPostQueryService {
  findPost(id: number): Promise<NexusGenRootTypes["Post"] | null>;
  getListPosts(req: ReqFindConnection): any;
}

@injectable()
export default class PostQueryService implements IPostQueryService {
  constructor(@inject("PrismaClient") private readonly prisma: PrismaClient) {}
  async findPost(id: number): Promise<NexusGenRootTypes["Post"] | null> {
    const res = await this.prisma.post.findUnique({
      where: { id },
    });
    return res && convertToNexusType.Post(res);
  }

  getListPosts(req: ReqFindConnection): any {
    return findManyCursorConnection<NexusGenRootTypes["Post"]>(
      async (_args) => {
        const res = await this.prisma.post.findMany({});

        return res.map((r) => convertToNexusType.Post(r));
      },
      () => Promise.resolve(-1),
      { ...req }
    );
  }
}
