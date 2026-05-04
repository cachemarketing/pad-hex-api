import { UserRole } from "../../domain/entity/user.entity"

export interface UserUpdatedDTO {
  id: string
  clerkId: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  isActive: boolean
  lastLoginAt: Date
  updatedAt: Date
}
