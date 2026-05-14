import { PostFilters, PostQueryRepository } from "../query/postQuery.repository"

export class PostFindAll {
  constructor(private repository: PostQueryRepository) {}

  async run(filters: PostFilters) {
    return await this.repository.findAll(filters)
  }
}
