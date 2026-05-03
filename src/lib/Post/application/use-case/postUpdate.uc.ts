import { Post } from "../../domain/entity/post.entity"
import { PostNotFoundError } from "../../domain/errors/postNotFoundError.error"
import { PostRepository } from "../../domain/repository/post.repository"
import { PostId } from "../../domain/value-objects/postId.vo"

export class PostUpdate {
  constructor(private repository: PostRepository) {}

  async run(id: PostId, post: Partial<Post>) {
    const exists = await this.repository.findById(id)

    if (!exists) throw new PostNotFoundError("Post no encontrado")

    const updatePost = exists.update(post)

    await this.repository.update(id, updatePost)
  }
}
