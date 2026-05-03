import { CategoryNotFoundError } from "../../domain/errors/categoryNotFoundError.error"
import { CategoryRepository } from "../../domain/repository/category.repository"
import { CategoryId } from "../../domain/value-objects/categoryId.vo"

export class CategoryFindById {
  constructor(private repository: CategoryRepository) {}

  async run(id: string) {
    const category = await this.repository.findById(new CategoryId(id))

    if (!category) throw new CategoryNotFoundError("Categoria no encontrada")

    return category
  }
}
