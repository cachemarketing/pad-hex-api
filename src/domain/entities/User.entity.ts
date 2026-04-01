import { v4 as uuidv4 } from "uuid"

export enum UserRole {
  ADMIN = "admin",
  EDITOR = "editor",
  AUTHOR = "author",
  READER = "reader",
}

export interface IUser {
  id?: string
  clerkId: string // ID de Clerk para sincronización
  email: string
  name: string
  role: UserRole
  avatar?: string
  isActive: boolean
  lastLoginAt?: Date
  createdAt?: Date
  updatedAt?: Date
}

export class User {
  public readonly id: string
  public readonly clerkId: string
  public readonly email: string
  public readonly name: string
  public readonly role: UserRole
  public readonly avatar?: string
  public readonly isActive: boolean
  public readonly lastLoginAt?: Date
  public readonly createdAt: Date
  public updatedAt: Date

  constructor(user: IUser) {
    this.validate(user)

    this.id = user.id || uuidv4()
    this.clerkId = user.clerkId
    this.email = user.email
    this.name = user.name
    this.role = user.role
    this.avatar = user.avatar
    this.isActive = user.isActive
    this.lastLoginAt = user.lastLoginAt
    this.createdAt = user.createdAt || new Date()
    this.updatedAt = user.updatedAt || new Date()
  }

  private validate(user: IUser): void {
    if (!user.clerkId) {
      throw new Error("El ID de Clerk es requerido")
    }
    if (!user.email) {
      throw new Error("El email es requerido")
    }
    if (!user.name) {
      throw new Error("El nombre es requerido")
    }
  }

  // Métodos de negocio
  canCreatePosts(): boolean {
    return (
      this.isActive &&
      [UserRole.ADMIN, UserRole.EDITOR, UserRole.AUTHOR].includes(this.role)
    )
  }

  canCreateCategories(): boolean {
    return (
      this.isActive && [UserRole.ADMIN, UserRole.EDITOR].includes(this.role)
    )
  }

  canEditAnyPost(): boolean {
    return (
      this.isActive && [UserRole.ADMIN, UserRole.EDITOR].includes(this.role)
    )
  }

  canDeleteAnyPost(): boolean {
    return this.isActive && this.role === UserRole.ADMIN
  }

  canManageUsers(): boolean {
    return this.isActive && this.role === UserRole.ADMIN
  }

  update(data: Partial<IUser>): User {
    const updatedData = {
      id: this.id,
      clerkId: this.clerkId,
      email: data.email ?? this.email,
      name: data.name ?? this.name,
      role: data.role ?? this.role,
      avatar: data.avatar ?? this.avatar,
      isActive: data.isActive ?? this.isActive,
      lastLoginAt: data.lastLoginAt ?? this.lastLoginAt,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    }

    return new User(updatedData)
  }

  toJSON() {
    return {
      id: this.id,
      clerkId: this.clerkId,
      email: this.email,
      name: this.name,
      role: this.role,
      avatar: this.avatar,
      isActive: this.isActive,
      lastLoginAt: this.lastLoginAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }
}
