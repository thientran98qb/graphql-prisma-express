import { inject, injectable } from "tsyringe";
import { IPostRepository } from "../repositories/post";
import { NexusGenInputs, NexusGenRootTypes } from "../generated/nexus-typegen";

export interface IPostUseCase {
  delete(id: number): Promise<NexusGenRootTypes["Post"]>;
  create(
    input: NexusGenInputs["CreatePostInput"]
  ): Promise<NexusGenRootTypes["Post"]>;
  update(
    input: NexusGenInputs["UpdatePostInput"]
  ): Promise<NexusGenRootTypes["Post"]>;
}

@injectable()
export default class PostUseCase implements IPostUseCase {
  constructor(
    @inject("PostRepository")
    private readonly PostRepository: IPostRepository
  ) {}

  async delete(id: number): Promise<NexusGenRootTypes["Post"]> {
    return this.PostRepository.delete(id);
  }

  async create(
    input: NexusGenInputs["CreatePostInput"]
  ): Promise<NexusGenRootTypes["Post"]> {
    return this.PostRepository.create(input);
  }

  async update(
    input: NexusGenInputs["UpdatePostInput"]
  ): Promise<NexusGenRootTypes["Post"]> {
    return this.PostRepository.update(input);
  }
}
