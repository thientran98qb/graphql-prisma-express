import { objectType } from "nexus";
import { Comment } from "nexus-prisma";
import { node } from "../interfaces/node";

export const commentObject = objectType({
  name: Comment.$name,
  definition(t) {
    t.implements(node);
    t.field("content", { type: "String" });
  },
});
