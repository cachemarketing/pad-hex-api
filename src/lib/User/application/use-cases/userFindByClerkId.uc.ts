import { UserNotFoundError } from "../../domain/error/userNotFoundError.error"
import { UserRepository } from "../../domain/repository/user.repository"
import { UserClerkId } from "../../domain/value-objects/UserClerkId.vo"

export class UserFindByClerkId {
  constructor(private repository: UserRepository) {}

  async run(clerkId: string) {
    const user = await this.repository.findByClerkId(new UserClerkId(clerkId))

    if (!user) throw new UserNotFoundError("User no encontrado")

    return user
  }
}
