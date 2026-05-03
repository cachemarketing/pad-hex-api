import { Category } from "../entity/category.entity"
import { CategoryId } from "../value-objects/categoryId.vo"

export interface CategoryRepository {
  save(category: Category): Promise<void>
  findAll(): Promise<Category[]>
  findById(id: CategoryId): Promise<Category | null>
  update(id: CategoryId, categoryData: Partial<Category>): Promise<void>
}
