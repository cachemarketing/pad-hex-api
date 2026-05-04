import { User, UserRole } from "../../domain/entity/user.entity"
import { UserRepository } from "../../domain/repository/user.repository"
import { UserClerkId } from "../../domain/value-objects/UserClerkId.vo"
import { UserEmail } from "../../domain/value-objects/UserEmail.vo"
import { UserId } from "../../domain/value-objects/UserId.vo"
import { UserIsActive } from "../../domain/value-objects/userIsActive.vo"
import { UserLastLoginAt } from "../../domain/value-objects/userLastLoginAt.vo"
import { UserName } from "../../domain/value-objects/userName.vo"
import { UserSaveDTO } from "../dto/userSave.dto"

export class UserSave {
  constructor(private repository: UserRepository) {}

  async run(dto: UserSaveDTO) {
    const user = new User({
      id: new UserId(dto.id),
      clerkId: new UserClerkId(dto.clerkId),
      email: new UserEmail(dto.email),
      name: new UserName(dto.name),
      role: dto.role,
      isActive: new UserIsActive(dto.isActive),
      lastLoginAt: new UserLastLoginAt(dto.lastLoginAt),
    })

    return await this.repository.save(user)
  }
}
