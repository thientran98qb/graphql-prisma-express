import { extendType, intArg, nonNull } from "nexus";
import { container } from "tsyringe";
import { IPostQueryService } from "../../queryServices/post";
import { postObject } from "../objects";

export const postQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("getPostById", {
      type: postObject,
      args: {
        id: nonNull(intArg({ description: "Id by post" })),
      },
      resolve: (_root, args, _ctx) => {
        const postQueryService =
          container.resolve<IPostQueryService>("PostQueryService");
        return postQueryService.findPost(args.id);
      },
    });

    /**
     * Pagination Posts
     */
    t.connectionField("posts", {
      type: postObject,
      resolve(_root, args, ctx, _info) {
        const postQueryService =
          container.resolve<IPostQueryService>("PostQueryService");
        return postQueryService.getListPosts({
          first: args.first,
          last: args.last,
          after: args.after,
          before: args.before,
        });
      },
    });
  },
});
