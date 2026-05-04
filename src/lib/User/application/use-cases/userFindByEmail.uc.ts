import { UserNotFoundError } from "../../domain/error/userNotFoundError.error"
import { UserRepository } from "../../domain/repository/user.repository"
import { UserEmail } from "../../domain/value-objects/UserEmail.vo"

export class UserFindByEmail {
  constructor(private repository: UserRepository) {}

  async run(email: string) {
    const user = await this.repository.findByEmail(new UserEmail(email))

    if (!user) throw new UserNotFoundError("User no encontrado")

    return user
  }
}
