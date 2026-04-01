import { Post } from "../entities/Post.entity"

export interface IPostRepository {
  save(post: Post): Promise<Post>
  findById(id: string): Promise<Post | null>
  findAll(): Promise<Post[]>
  findBySlug(slug: string): Promise<Post | null>
  findByCategory(categoryId: string): Promise<Post[]> // ← CAMBIADO: ahora recibe categoryId
  delete(id: string): Promise<void>
  update(id: string, post: Partial<Post>): Promise<Post>
}
