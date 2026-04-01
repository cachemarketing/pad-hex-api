import { User, UserRole } from "../entities/User.entity"
export interface IUserRepository {
  save(user: User): Promise<User>
  findById(id: string): Promise<User | null>
  findByClerkId(clerkId: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findAll(): Promise<User[]>
  update(id: string, data: Partial<User>): Promise<User>
  delete(id: string): Promise<void>
  exists(id: string): Promise<boolean>
}
