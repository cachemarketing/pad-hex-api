import { UserRole } from "../../domain/entity/user.entity"

export interface UserSaveDTO {
  id: string
  clerkId: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  isActive: boolean
  lastLoginAt: Date
}
