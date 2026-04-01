// infrastructure/repositories/TursoCategoryRepository.ts
import { ICategoryRepository } from "../../domain/repositories/ICategoryRepository"
import { Category, ICategory } from "../../domain/entities/Category.entity"
import { TursoDatabase } from "../database/turso.database"

export class TursoCategoryRepository implements ICategoryRepository {
  private db = TursoDatabase.getInstance().getClient()

  async save(category: Category): Promise<Category> {
    await this.db.execute({
      sql: `INSERT INTO categories (id, name, slug, description, createdAt, updatedAt) 
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [
        category.id,
        category.name,
        category.slug,
        category.description || null,
        category.createdAt.toISOString(),
        category.updatedAt.toISOString(),
      ],
    })

    return category
  }

  async findById(id: string): Promise<Category | null> {
    const result = await this.db.execute({
      sql: "SELECT * FROM categories WHERE id = ?",
      args: [id],
    })

    if (result.rows.length === 0) return null
    return this.mapToCategory(result.rows[0])
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const result = await this.db.execute({
      sql: "SELECT * FROM categories WHERE slug = ?",
      args: [slug],
    })

    if (result.rows.length === 0) return null
    return this.mapToCategory(result.rows[0])
  }

  async findAll(): Promise<Category[]> {
    const result = await this.db.execute(
      "SELECT * FROM categories ORDER BY name ASC",
    )
    return result.rows.map((row) => this.mapToCategory(row))
  }

  async delete(id: string): Promise<void> {
    // ✅ SOLUCIÓN: Convertir explícitamente a número
    const postsCount = await this.db.execute({
      sql: "SELECT COUNT(*) as count FROM posts WHERE categoryId = ?",
      args: [id],
    })

    // Convertir el resultado a número (manejar diferentes tipos)
    const count = Number(postsCount.rows[0].count)

    if (count > 0) {
      throw new Error(
        "No se puede eliminar la categoría porque tiene posts asociados",
      )
    }

    await this.db.execute({
      sql: "DELETE FROM categories WHERE id = ?",
      args: [id],
    })
  }

  async update(id: string, categoryData: Partial<Category>): Promise<Category> {
    const existing = await this.findById(id)
    if (!existing) throw new Error("Categoría no encontrada")

    const updatedCategory = existing.update(categoryData)

    await this.db.execute({
      sql: `UPDATE categories SET 
        name = ?, slug = ?, description = ?, updatedAt = ?
        WHERE id = ?`,
      args: [
        updatedCategory.name,
        updatedCategory.slug,
        updatedCategory.description || null,
        updatedCategory.updatedAt.toISOString(),
        id,
      ],
    })

    return updatedCategory
  }

  async exists(id: string): Promise<boolean> {
    const result = await this.db.execute({
      sql: "SELECT 1 FROM categories WHERE id = ? LIMIT 1",
      args: [id],
    })
    return result.rows.length > 0
  }

  private mapToCategory(row: any): Category {
    return new Category({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    })
  }
}
