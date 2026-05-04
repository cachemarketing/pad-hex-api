import { UserClerkId } from "../value-objects/UserClerkId.vo"
import { UserCreatedAt } from "../value-objects/userCreatedAt.vo"
import { UserEmail } from "../value-objects/UserEmail.vo"
import { UserId } from "../value-objects/UserId.vo"
import { UserIsActive } from "../value-objects/userIsActive.vo"
import { UserLastLoginAt } from "../value-objects/userLastLoginAt.vo"
import { UserName } from "../value-objects/userName.vo"
import { UserUpdatedAt } from "../value-objects/userUpdatedAt.vo"

export enum UserRole {
  ADMIN = "admin",
  EDITOR = "editor",
  AUTHOR = "author",
  READER = "reader",
}

export interface IUser {
  id: UserId
  clerkId: UserClerkId
  email: UserEmail
  name: UserName
  role: UserRole
  avatar?: string
  isActive: UserIsActive
  lastLoginAt?: UserLastLoginAt
  createdAt?: UserCreatedAt
  updatedAt?: UserUpdatedAt
}

export class User {
  public readonly id: UserId
  public readonly clerkId: UserClerkId
  public readonly email: UserEmail
  public readonly name: UserName
  public readonly role: UserRole
  public readonly avatar?: string
  public readonly isActive: UserIsActive
  public readonly lastLoginAt?: UserLastLoginAt
  public readonly createdAt?: UserCreatedAt
  public updatedAt?: UserUpdatedAt

  constructor(user: IUser) {
    this.id = user.id
    this.clerkId = user.clerkId
    this.email = user.email
    this.name = user.name
    this.role = user.role
    this.avatar = user.avatar
    this.isActive = user.isActive
    this.lastLoginAt = user.lastLoginAt
    this.createdAt = user.createdAt
    this.updatedAt = user.updatedAt
  }

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
      updatedAt: new UserUpdatedAt(new Date()),
    }

    return new User(updatedData)
  }

  toPrimitives() {
    return {
      id: this.id.value,
      clerkId: this.clerkId.value,
      email: this.email.value,
      name: this.name.value,
      role: this.role,
      avatar: this.avatar,
      isActive: this.isActive.value,
      lastLoginAt: this.lastLoginAt?.value,
      createdAt: this.createdAt?.value,
      updatedAt: this.updatedAt?.value,
    }
  }
}
