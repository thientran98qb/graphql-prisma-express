import { objectType } from "nexus";
import { Post } from "nexus-prisma";

export const postObject = objectType({
  name: Post.$name,
  definition(t) {
    t.field(Post.id);
    t.field(Post.title);
    t.field(Post.content);
    t.field(Post.likesCount);
    t.field(Post.createdAt);
    t.field(Post.updatedAt);
  },
});
