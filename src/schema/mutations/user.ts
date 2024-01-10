import { arg, extendType, inputObjectType, nonNull, objectType } from "nexus";
import { userObject } from "../objects";
import { container } from "tsyringe";
import { IUserUseCase } from "../../useCases/user";
import { NexusGenRootTypes } from "../../generated/nexus-typegen";

export const userMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("register", {
      type: userObject,
      args: {
        input: nonNull(arg({ type: registerInput })),
      },
      resolve: (
        _parent,
        args,
        _ctx,
        _info
      ): Promise<Omit<NexusGenRootTypes["User"], "password">> => {
        const userUseCase = container.resolve<IUserUseCase>("UserUseCase");
        return userUseCase.create(args.input);
      },
    });
    t.field("login", {
      type: authObject,
      args: {
        input: nonNull(arg({ type: loginInput })),
      },
      resolve: (_parent, args, _ctx, _info) => {
        const userUseCase = container.resolve<IUserUseCase>("UserUseCase");
        return userUseCase.loginUser(args.input);
      },
    });
  },
});

const registerInput = inputObjectType({
  name: "RegisterInput",
  definition(t) {
    t.nonNull.string("email");
    t.nonNull.string("password");
    t.nonNull.string("fullname");
  },
});

const loginInput = inputObjectType({
  name: "LoginInput",
  definition(t) {
    t.nonNull.string("email");
    t.nonNull.string("password");
  },
});

export const authObject = objectType({
  name: "Auth",
  definition(t) {
    t.field("accessToken", { type: "String" });
    t.field("user", { type: "User" });
  },
});
