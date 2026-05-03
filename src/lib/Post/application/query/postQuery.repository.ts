import { PostDetailDTO } from "../dto/PostDetail.dto"

export interface PostFilters {
  isFeatured?: boolean
  title?: string
  authorId?: string
}

export interface PostQueryRepository {
  findById(id: string): Promise<PostDetailDTO | null>
  findAll(filters: PostFilters): Promise<PostDetailDTO[]>
  findBySlug(slug: string): Promise<PostDetailDTO | null>
}
