import { PrismaClient } from "@prisma/client";
import { container } from "tsyringe";
import PostQueryService from "./queryServices/post";
import PostUseCase from "./useCases/post";
import PostRepository from "./repositories/post";
import UserRepository from "./repositories/user";
import UserUseCase from "./useCases/user";

type AnyConstructor = new (...args: any[]) => unknown;

export const setContainerInjection = () => {
  const prismaClient = new PrismaClient();

  container.register("PrismaClient", { useValue: prismaClient });

  /** ==== Register Class Injection ==== */
  const classes = [
    PostQueryService,
    PostRepository,
    PostUseCase,
    UserRepository,
    UserUseCase,
  ] as AnyConstructor[];
  /** ==== End Register Class Injection ==== */

  for (const kclass of classes) {
    container.register(kclass.name, {
      useClass: kclass,
    });
  }
};
