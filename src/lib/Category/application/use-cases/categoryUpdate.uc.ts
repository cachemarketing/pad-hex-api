import { Category } from "../../domain/entity/category.entity"
import { CategoryNotFoundError } from "../../domain/errors/categoryNotFoundError.error"
import { CategoryRepository } from "../../domain/repository/category.repository"
import { CategoryId } from "../../domain/value-objects/categoryId.vo"

export class CategoryUpdate {
  constructor(private repository: CategoryRepository) {}

  async run(id: CategoryId, categoryData: Partial<Category>) {
    const exists = await this.repository.findById(id)

    if (!exists) throw new CategoryNotFoundError("Post no encontrado")

    const updatePost = exists.update(categoryData)

    await this.repository.update(id, updatePost)
  }
}
