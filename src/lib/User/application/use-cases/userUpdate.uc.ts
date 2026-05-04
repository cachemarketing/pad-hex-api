import { User } from "../../domain/entity/user.entity"
import { UserNotFoundError } from "../../domain/error/userNotFoundError.error"
import { UserRepository } from "../../domain/repository/user.repository"
import { UserClerkId } from "../../domain/value-objects/UserClerkId.vo"
import { UserEmail } from "../../domain/value-objects/UserEmail.vo"
import { UserId } from "../../domain/value-objects/UserId.vo"
import { UserIsActive } from "../../domain/value-objects/userIsActive.vo"
import { UserLastLoginAt } from "../../domain/value-objects/userLastLoginAt.vo"
import { UserName } from "../../domain/value-objects/userName.vo"
import { UserUpdatedAt } from "../../domain/value-objects/userUpdatedAt.vo"
import { UserUpdatedDTO } from "../dto/userUpdate.dto"

export class UserUpdate {
  constructor(private repository: UserRepository) {}

  async run(id: string, userData: Partial<UserUpdatedDTO>) {
    const existingUser = await this.repository.findById(new UserId(id))

    if (!existingUser) {
      throw new UserNotFoundError("User not found")
    }

    const user = new User({
      id: new UserId(userData.id ?? ""),
      clerkId: new UserClerkId(userData.clerkId ?? ""),
      email: new UserEmail(userData.email ?? ""),
      name: new UserName(userData.name ?? ""),
      role: userData.role ?? existingUser.role,
      isActive: new UserIsActive(userData.isActive ?? false),
      lastLoginAt: new UserLastLoginAt(userData.lastLoginAt ?? new Date()),
      updatedAt: new UserUpdatedAt(new Date()),
    })

    const updatedUser = await this.repository.update(
      existingUser.id,
      user.update(user),
    )

    return updatedUser
  }
}
