import { Category } from "../../domain/entity/category.entity"
import { CategoryRepository } from "../../domain/repository/category.repository"
import { CategoryCreatedAt } from "../../domain/value-objects/categoryCreatedAt.vo"
import { CategoryCreatedBy } from "../../domain/value-objects/categoryCreatedBy.vo"
import { CategoryDescription } from "../../domain/value-objects/categoryDescription.vo"
import { CategoryId } from "../../domain/value-objects/categoryId.vo"
import { CategoryName } from "../../domain/value-objects/categoryName.vo"
import { CategorySlug } from "../../domain/value-objects/categorySlug.vo"
import { CategoryUpdatedAt } from "../../domain/value-objects/categoryUpdatedAt.vo"
import { CategorySaveDTO } from "../dto/categorySaveDTO.dto"

export class CategorySave {
  constructor(private repository: CategoryRepository) {}

  async run(dto: CategorySaveDTO) {
    const category = new Category({
      id: new CategoryId(dto.id),
      name: new CategoryName(dto.name),
      slug: new CategorySlug(dto.slug),
      description: new CategoryDescription(dto.description ?? null),
      createdBy: new CategoryCreatedBy(dto.createdBy),
      createdAt: new CategoryCreatedAt(new Date()),
      updatedAt: new CategoryUpdatedAt(new Date()),
    })

    return await this.repository.save(category)
  }
}
