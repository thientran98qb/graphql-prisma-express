import { objectType } from "nexus";
import { User } from "nexus-prisma";

export const userObject = objectType({
  name: User.$name,
  definition(t) {
    t.field(User.id);
    t.field(User.fullname);
    t.field(User.email);
    t.field(User.createdAt);
    t.field(User.updatedAt);
  },
});
