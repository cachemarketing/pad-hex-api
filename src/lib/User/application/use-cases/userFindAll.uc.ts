import { UserRepository } from "../../domain/repository/user.repository"

export class UserFindAll {
  constructor(private repository: UserRepository) {}

  async run() {
    return await this.repository.findAll()
  }
}
