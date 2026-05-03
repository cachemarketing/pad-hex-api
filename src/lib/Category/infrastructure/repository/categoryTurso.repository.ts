import { TursoDatabase } from "../../../shared/infrastructure/database/turso.db"
import { Category } from "../../domain/entity/category.entity"
import { CategoryNotFoundError } from "../../domain/errors/categoryNotFoundError.error"
import { CategoryRepository } from "../../domain/repository/category.repository"
import { CategoryCreatedAt } from "../../domain/value-objects/categoryCreatedAt.vo"
import { CategoryCreatedBy } from "../../domain/value-objects/categoryCreatedBy.vo"
import { CategoryDescription } from "../../domain/value-objects/categoryDescription.vo"
import { CategoryId } from "../../domain/value-objects/categoryId.vo"
import { CategoryName } from "../../domain/value-objects/categoryName.vo"
import { CategorySlug } from "../../domain/value-objects/categorySlug.vo"
import { CategoryUpdatedAt } from "../../domain/value-objects/categoryUpdatedAt.vo"

interface CategoryTurso {
  id: string
  name: string
  slug: string
  description?: string
  createdBy?: string
  createdAt: Date
  updatedAt: Date
}

export class CategoryTursoRepository implements CategoryRepository {
  private db = TursoDatabase.getInstance().getClient()
  private tableName = "categories"
  async save(category: Category): Promise<void> {
    await this.db.execute({
      sql: `INSERT INTO ${this.tableName} (id, name, slug, description, createdBy) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        category.id.value,
        category.name.value,
        category.slug.value,
        category.description?.value || null,
        category.createdBy?.value ?? null,
      ],
    })
  }

  async findAll(): Promise<Category[]> {
    const query = {
      sql: `SELECT * FROM ${this.tableName}`,
      args: [],
    }

    const result = await this.db.execute(query)

    return result.rows.map((row) =>
      this.mapToDomain(row as unknown as CategoryTurso),
    )
  }

  async findById(id: CategoryId): Promise<Category | null> {
    const query = {
      sql: `SELECT * FROM ${this.tableName} WHERE id = ?`,
      args: [id.value],
    }

    const result = await this.db.execute(query)

    if (!result.rows) return null

    return this.mapToDomain(result.rows[0] as unknown as CategoryTurso)
  }

  async update(id: CategoryId, categoryData: Partial<Category>): Promise<void> {
    const existing = await this.findById(id)
    if (!existing) throw new CategoryNotFoundError("Categoría no encontrada")

    const updatedCategory = existing.update(categoryData)

    await this.db.execute({
      sql: `UPDATE categories SET 
        name = ?, slug = ?, description = ?, updatedAt = ?
        WHERE id = ?`,
      args: [
        updatedCategory.name.value,
        updatedCategory.slug.value,
        updatedCategory.description?.value || null,
        updatedCategory.updatedAt?.value || new Date(),
        id.value,
      ],
    })
  }

  private mapToDomain(row: CategoryTurso): Category {
    return new Category({
      id: new CategoryId(row.id),
      name: new CategoryName(row.name),
      slug: new CategorySlug(row.slug),
      description: new CategoryDescription(row.description ?? null),
      createdBy: new CategoryCreatedBy(row.createdBy ?? ""),
      createdAt: new CategoryCreatedAt(row.createdAt),
      updatedAt: new CategoryUpdatedAt(row.updatedAt),
    })
  }
}
