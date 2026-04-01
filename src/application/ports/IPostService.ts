import { Post } from "../../domain/entities/Post.entity"
import { IPost } from "../../domain/entities/Post.entity"

export interface IPostService {
  createPost(postData: IPost): Promise<Post>
  getPost(id: string): Promise<Post | null>
  getAllPosts(): Promise<Post[]>
  deletePost(id: string): Promise<void>
  updatePost(id: string, postData: Partial<IPost>): Promise<Post>
}
