import { UserNotFoundError } from "../../domain/error/userNotFoundError.error"
import { UserRepository } from "../../domain/repository/user.repository"
import { UserId } from "../../domain/value-objects/UserId.vo"

export class UserfindById {
  constructor(private repository: UserRepository) {}

  async run(id: string) {
    const user = await this.repository.findById(new UserId(id))

    if (!user) throw new UserNotFoundError("User no encontrado")

    return user
  }
}
