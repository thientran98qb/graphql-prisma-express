import { arg, extendType, inputObjectType, intArg, nonNull } from "nexus";
import { postObject } from "../objects";
import { container } from "tsyringe";
import { IPostUseCase } from "../../useCases/post";

export const postMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createPost", {
      type: postObject,
      args: {
        input: nonNull(arg({ type: createPostInput })),
      },
      resolve: (_source, args, _ctx, _info) => {
        const postUseCase = container.resolve<IPostUseCase>("PostUseCase");
        return postUseCase.create(args.input);
      },
    });

    t.field("updatePost", {
      type: postObject,
      args: {
        input: nonNull(arg({ type: updatePostInput })),
      },
      resolve: (_source, args, _ctx, _info) => {
        const postUseCase = container.resolve<IPostUseCase>("PostUseCase");
        return postUseCase.update(args.input);
      },
    });

    t.field("deletePost", {
      type: postObject,
      args: {
        id: nonNull(intArg()),
      },
      resolve: (_source, args, _ctx, _info) => {
        const postUseCase = container.resolve<IPostUseCase>("PostUseCase");
        return postUseCase.delete(args.id);
      },
    });
  },
});

const createPostInput = inputObjectType({
  name: "CreatePostInput",
  definition(t) {
    t.nonNull.string("title", { description: "title of post" });
    t.nonNull.string("content", { description: "content of post" });
  },
});

const updatePostInput = inputObjectType({
  name: "UpdatePostInput",
  definition(t) {
    t.nonNull.int("id", { description: "title of post" });
    t.nonNull.string("title", { description: "title of post" });
    t.nonNull.string("content", { description: "content of post" });
  },
});
