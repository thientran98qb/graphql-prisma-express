import { Post, User } from "@prisma/client";
import { NexusGenRootTypes } from "../generated/nexus-typegen";
import { convertDateToDateTime } from "./datetime";

export const convertToNexusType = {
  Post: (
    data: Pick<Post, Extract<keyof Post, keyof NexusGenRootTypes["Post"]>>
  ): NexusGenRootTypes["Post"] & { __typename: "Post" } => ({
    ...data,
    createdAt: convertDateToDateTime(data.createdAt),
    updatedAt: convertDateToDateTime(data.updatedAt),
    __typename: "Post",
  }),

  User: (
    data: Pick<
      Omit<User, "password">,
      Extract<keyof Omit<User, "password">, keyof NexusGenRootTypes["User"]>
    >
  ): Omit<NexusGenRootTypes["User"], "password"> & { __typename: "User" } => ({
    ...data,
    createdAt: convertDateToDateTime(data.createdAt),
    updatedAt: convertDateToDateTime(data.updatedAt),
    __typename: "User",
  }),
};
