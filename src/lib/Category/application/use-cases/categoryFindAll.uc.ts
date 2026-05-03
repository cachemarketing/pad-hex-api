import { CategoryRepository } from "../../domain/repository/category.repository"

export class CategoryFindAll {
  constructor(private repository: CategoryRepository) {}

  async run() {
    return await this.repository.findAll()
  }
}
