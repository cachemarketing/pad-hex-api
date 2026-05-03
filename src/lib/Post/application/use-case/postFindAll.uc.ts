import { PostFilters, PostQueryRepository } from "../query/postQuery.repository"

export class PostFindAll {
  constructor(private repository: PostQueryRepository) {}

  async rum(filters: PostFilters) {
    return await this.repository.findAll(filters)
  }
}
