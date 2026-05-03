import { PostNotFoundError } from "../../domain/errors/postNotFoundError.error"
import { PostQueryRepository } from "../query/postQuery.repository"

export class PostFindBySlug {
  constructor(private repository: PostQueryRepository) {}

  async run(slug: string) {
    const post = await this.repository.findBySlug(slug)

    if (!post) {
      throw new PostNotFoundError("Post no encontrado")
    }

    return post
  }
}
