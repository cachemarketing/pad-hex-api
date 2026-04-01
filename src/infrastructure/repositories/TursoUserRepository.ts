import { IUserRepository } from "../../domain/repositories/IUserRepository"
import { User, IUser, UserRole } from "../../domain/entities/User.entity"
import { TursoDatabase } from "../database/turso.database"

export class TursoUserRepository implements IUserRepository {
  private db = TursoDatabase.getInstance().getClient()

  async save(user: User): Promise<User> {
    await this.db.execute({
      sql: `INSERT INTO users (id, clerkId, email, name, role, avatar, isActive, lastLoginAt, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(clerkId) DO UPDATE SET
              email = excluded.email,
              name = excluded.name,
              role = excluded.role,
              avatar = excluded.avatar,
              isActive = excluded.isActive,
              updatedAt = excluded.updatedAt`,
      args: [
        user.id,
        user.clerkId,
        user.email,
        user.name,
        user.role,
        user.avatar || null,
        user.isActive ? 1 : 0,
        user.lastLoginAt?.toISOString() || null,
        user.createdAt.toISOString(),
        user.updatedAt.toISOString(),
      ],
    })

    return user
  }

  async findById(id: string): Promise<User | null> {
    const result = await this.db.execute({
      sql: "SELECT * FROM users WHERE id = ?",
      args: [id],
    })

    if (result.rows.length === 0) return null
    return this.mapToUser(result.rows[0])
  }

  async findByClerkId(clerkId: string): Promise<User | null> {
    const result = await this.db.execute({
      sql: "SELECT * FROM users WHERE clerkId = ?",
      args: [clerkId],
    })

    if (result.rows.length === 0) return null
    return this.mapToUser(result.rows[0])
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.db.execute({
      sql: "SELECT * FROM users WHERE email = ?",
      args: [email],
    })

    if (result.rows.length === 0) return null
    return this.mapToUser(result.rows[0])
  }

  async findAll(): Promise<User[]> {
    const result = await this.db.execute(
      "SELECT * FROM users ORDER BY createdAt DESC",
    )
    return result.rows.map((row) => this.mapToUser(row))
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    const existing = await this.findById(id)
    if (!existing) throw new Error("Usuario no encontrado")

    const updatedUser = existing.update(userData)

    await this.db.execute({
      sql: `UPDATE users SET 
        email = ?, name = ?, role = ?, avatar = ?, 
        isActive = ?, updatedAt = ?
        WHERE id = ?`,
      args: [
        updatedUser.email,
        updatedUser.name,
        updatedUser.role,
        updatedUser.avatar || null,
        updatedUser.isActive ? 1 : 0,
        updatedUser.updatedAt.toISOString(),
        id,
      ],
    })

    return updatedUser
  }

  async delete(id: string): Promise<void> {
    // Verificar si tiene posts o categorías
    const postsCount = await this.db.execute({
      sql: "SELECT COUNT(*) as count FROM posts WHERE authorId = ?",
      args: [id],
    })

    const categoriesCount = await this.db.execute({
      sql: "SELECT COUNT(*) as count FROM categories WHERE createdBy = ?",
      args: [id],
    })

    const totalPosts = Number(postsCount.rows[0].count)
    const totalCategories = Number(categoriesCount.rows[0].count)

    if (totalPosts > 0 || totalCategories > 0) {
      throw new Error(
        `No se puede eliminar el usuario porque tiene ${totalPosts} posts y ${totalCategories} categorías`,
      )
    }

    await this.db.execute({
      sql: "DELETE FROM users WHERE id = ?",
      args: [id],
    })
  }

  async exists(clerkId: string): Promise<boolean> {
    const result = await this.db.execute({
      sql: "SELECT 1 FROM users WHERE clerkId = ? LIMIT 1",
      args: [clerkId],
    })
    return result.rows.length > 0
  }

  async updateLastLogin(clerkId: string): Promise<void> {
    await this.db.execute({
      sql: "UPDATE users SET lastLoginAt = ? WHERE clerkId = ?",
      args: [new Date().toISOString(), clerkId],
    })
  }

  async getUsersByRole(role: UserRole): Promise<User[]> {
    const result = await this.db.execute({
      sql: "SELECT * FROM users WHERE role = ? ORDER BY name ASC",
      args: [role],
    })
    return result.rows.map((row) => this.mapToUser(row))
  }

  async countUsers(): Promise<number> {
    const result = await this.db.execute("SELECT COUNT(*) as count FROM users")
    return Number(result.rows[0].count)
  }

  private mapToUser(row: any): User {
    return new User({
      id: row.id,
      clerkId: row.clerkId,
      email: row.email,
      name: row.name,
      role: row.role as UserRole,
      avatar: row.avatar,
      isActive: Boolean(row.isActive),
      lastLoginAt: row.lastLoginAt ? new Date(row.lastLoginAt) : undefined,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    })
  }
}
