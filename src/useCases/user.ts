import { inject, injectable } from "tsyringe";
import { IUserRepository } from "../repositories/user";
import { NexusGenInputs, NexusGenRootTypes } from "../generated/nexus-typegen";

export interface IUserUseCase {
  create(
    input: NexusGenInputs["RegisterInput"]
  ): Promise<Omit<NexusGenRootTypes["User"], "password">>;
}

@injectable()
export default class UserUseCase implements IUserUseCase {
  constructor(
    @inject("UserRepository")
    private readonly UserRepository: IUserRepository
  ) {}

  async create(
    input: NexusGenInputs["RegisterInput"]
  ): Promise<Omit<NexusGenRootTypes["User"], "password">> {
    return this.UserRepository.createUser(input);
  }
}
