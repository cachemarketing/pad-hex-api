import { Post } from "../entity/post.entity"

export interface PostRepository {
  save(post: Post): void
}
