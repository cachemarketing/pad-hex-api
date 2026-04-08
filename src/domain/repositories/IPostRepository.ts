import { Post } from "../entities/Post.entity"

export interface PostFilters {
  isFeatured?: boolean
  title?: string
  authorId?: string
}

export interface IPostRepository {
  save(post: Post): Promise<Post>
  findById(id: string): Promise<Post | null>
  findAll(filters: PostFilters): Promise<Post[]>
  findBySlug(slug: string): Promise<Post | null>
  findByCategory(categoryId: string): Promise<Post[]>
  delete(id: string): Promise<void>
  update(id: string, post: Partial<Post>): Promise<Post>
}
