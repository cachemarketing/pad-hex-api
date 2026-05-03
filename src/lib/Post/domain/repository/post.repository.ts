import { Post } from "../entity/post.entity"
import { PostId } from "../value-objects/postId.vo"

export interface PostRepository {
  save(post: Post): Promise<void>
  update(id: PostId, post: Partial<Post>): Promise<void>
  findById(id: PostId): Promise<Post | null>
}
