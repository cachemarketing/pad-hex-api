import { TursoDatabase } from "../../../shared/infrastructure/database/turso.db"
import { User, UserRole } from "../../domain/entity/user.entity"
import { UserRepository } from "../../domain/repository/user.repository"
import { UserClerkId } from "../../domain/value-objects/UserClerkId.vo"
import { UserCreatedAt } from "../../domain/value-objects/userCreatedAt.vo"
import { UserEmail } from "../../domain/value-objects/UserEmail.vo"
import { UserId } from "../../domain/value-objects/UserId.vo"
import { UserIsActive } from "../../domain/value-objects/userIsActive.vo"
import { UserLastLoginAt } from "../../domain/value-objects/userLastLoginAt.vo"
import { UserName } from "../../domain/value-objects/userName.vo"
import { UserUpdatedAt } from "../../domain/value-objects/userUpdatedAt.vo"

interface UserTurso {
  id: string
  clerkId: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  isActive: boolean
  lastLoginAt: Date
  createdAt: Date
  updatedAt: Date
}

export class UserTursoRepository implements UserRepository {
  private db = TursoDatabase.getInstance().getClient()

  async save(user: User): Promise<void> {
    await this.db.execute({
      sql: `INSERT INTO users (id, clerkId, email, name, role, avatar, isActive, lastLoginAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(clerkId) DO UPDATE SET
              email = excluded.email,
              name = excluded.name,
              role = excluded.role,
              avatar = excluded.avatar,
              isActive = excluded.isActive,
              `,
      args: [
        user.id.value,
        user.clerkId.value,
        user.email.value,
        user.name.value,
        user.role,
        user.avatar || null,
        user.isActive.value ? 1 : 0,
        user.lastLoginAt?.value.toISOString() || null,
      ],
    })
  }

  async findAll(): Promise<User[]> {
    const query = {
      sql: "SELECT * FROM users",
      args: [],
    }

    const result = await this.db.execute(query)

    return result.rows.map((row) =>
      this.mapToDomain(row as unknown as UserTurso),
    )
  }

  async findById(id: UserId): Promise<User | null> {
    const query = {
      sql: "SELECT * FROM users WHERE id = ?",
      args: [id.value],
    }

    const result = await this.db.execute(query)

    if (!result.rows) return null

    return this.mapToDomain(result.rows[0] as unknown as UserTurso)
  }

  async findByClerkId(clerkId: UserClerkId): Promise<User | null> {
    const query = {
      sql: "SELECT * FROM users WHERE clerkId = ?",
      args: [clerkId.value],
    }

    const result = await this.db.execute(query)

    if (!result.rows) return null

    return this.mapToDomain(result.rows[0] as unknown as UserTurso)
  }

  async findByEmail(email: UserEmail): Promise<User | null> {
    const query = {
      sql: "SELECT * FROM users WHERE email = ?",
      args: [email.value],
    }

    const result = await this.db.execute(query)

    if (!result.rows) return null

    return this.mapToDomain(result.rows[0] as unknown as UserTurso)
  }

  async update(id: UserId, data: Partial<User>): Promise<void> {
    const existing = await this.findById(id)
    if (!existing) throw new Error("Usuario no encontrado")

    const updatedUser = existing.update(data)

    await this.db.execute({
      sql: `UPDATE users SET 
        email = ?, name = ?, role = ?, avatar = ?, 
        isActive = ?, updatedAt = ?
        WHERE id = ?`,
      args: [
        updatedUser.email.value,
        updatedUser.name.value,
        updatedUser.role,
        updatedUser.avatar || null,
        updatedUser.isActive ? 1 : 0,
        updatedUser.updatedAt?.value.toISOString() ?? new Date(),
        id.value,
      ],
    })
  }

  private mapToDomain(row: UserTurso): User {
    return new User({
      id: new UserId(row.id),
      clerkId: new UserClerkId(row.clerkId),
      email: new UserEmail(row.email),
      name: new UserName(row.name),
      role: row.role,
      isActive: new UserIsActive(row.isActive),
      lastLoginAt: new UserLastLoginAt(row.lastLoginAt),
      createdAt: new UserCreatedAt(row.createdAt),
      updatedAt: new UserUpdatedAt(row.updatedAt),
    })
  }
}
