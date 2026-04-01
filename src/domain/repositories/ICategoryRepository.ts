import { Category } from "../entities/Category.entity"

export interface ICategoryRepository {
  save(category: Category): Promise<Category>
  findById(id: string): Promise<Category | null>
  findBySlug(slug: string): Promise<Category | null>
  findAll(): Promise<Category[]>
  delete(id: string): Promise<void>
  update(id: string, category: Partial<Category>): Promise<Category>
  exists(id: string): Promise<boolean> // ← Método útil para validar
}
