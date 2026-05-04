import { User } from "../entity/user.entity"
import { UserClerkId } from "../value-objects/UserClerkId.vo"
import { UserEmail } from "../value-objects/UserEmail.vo"
import { UserId } from "../value-objects/UserId.vo"

export interface UserRepository {
  save(user: User): Promise<void>
  findById(id: UserId): Promise<User | null>
  findByClerkId(clerkId: UserClerkId): Promise<User | null>
  findByEmail(email: UserEmail): Promise<User | null>
  findAll(): Promise<User[]>
  update(id: UserId, data: Partial<User>): Promise<void>
  //delete(id: UserId): Promise<void>
  //exists(id: UserId): Promise<boolean>
}
