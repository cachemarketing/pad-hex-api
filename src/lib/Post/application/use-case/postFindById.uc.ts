import { PostNotFoundError } from "../../domain/errors/postNotFoundError.error"
import { PostQueryRepository } from "../query/postQuery.repository"

export class PostFindById {
  constructor(private repository: PostQueryRepository) {}

  async run(id: string) {
    const post = await this.repository.findById(id)

    if (!post) {
      throw new PostNotFoundError("Post no encontrado")
    }

    return post
  }
}
