import { User, UserRole } from "../../domain/entities/User.entity"
import { IUserRepository } from "../../domain/repositories/IUserRepository"
import { clerkClient } from "@clerk/clerk-sdk-node"

export class UserSyncService {
  constructor(private userRepository: IUserRepository) {}

  async syncUserFromClerk(clerkId: string): Promise<User> {
    try {
      // Obtener usuario de Clerk
      const clerkUser = await clerkClient.users.getUser(clerkId)

      if (!clerkUser) {
        throw new Error(`Usuario de Clerk no encontrado: ${clerkId}`)
      }

      // Obtener email principal
      const primaryEmail =
        clerkUser.emailAddresses.find(
          (email) => email.id === clerkUser.primaryEmailAddressId,
        )?.emailAddress || clerkUser.emailAddresses[0]?.emailAddress

      if (!primaryEmail) {
        throw new Error(`Usuario sin email: ${clerkId}`)
      }

      // Obtener rol de metadata pública
      const role =
        (clerkUser.publicMetadata?.role as UserRole) || UserRole.READER

      // Verificar si ya existe en nuestra DB
      const existingUser = await this.userRepository.findByClerkId(clerkId)

      const userData = {
        clerkId: clerkUser.id,
        email: primaryEmail,
        name:
          `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
          clerkUser.username ||
          primaryEmail.split("@")[0],
        role: role,
        avatar: clerkUser.imageUrl,
        isActive: !clerkUser.banned && clerkUser.emailAddresses.length > 0,
        lastLoginAt: new Date(),
      }

      if (existingUser) {
        // Actualizar usuario existente
        return await this.userRepository.update(existingUser.id, userData)
      } else {
        // Crear nuevo usuario
        const user = new User(userData)
        return await this.userRepository.save(user)
      }
    } catch (error) {
      console.error("Error sincronizando usuario:", error)
      throw error
    }
  }

  async syncAllUsers(): Promise<{ synced: number; failed: number }> {
    try {
      let offset = 0
      const limit = 100
      let hasMore = true
      let synced = 0
      let failed = 0

      while (hasMore) {
        const clerkUsers = await clerkClient.users.getUserList({
          limit,
          offset,
        })

        for (const clerkUser of clerkUsers) {
          try {
            await this.syncUserFromClerk(clerkUser.id)
            synced++
          } catch (error) {
            console.error(`Error sincronizando usuario ${clerkUser.id}:`, error)
            failed++
          }
        }

        hasMore = clerkUsers.length === limit
        offset += limit
      }

      console.log(
        `✅ Sincronización de usuarios completada: ${synced} sincronizados, ${failed} fallidos`,
      )
      return { synced, failed }
    } catch (error) {
      console.error("Error en sincronización masiva:", error)
      throw error
    }
  }

  // ========== MÉTODOS FALTANTES ==========

  async getUserByClerkId(clerkId: string): Promise<User | null> {
    try {
      return await this.userRepository.findByClerkId(clerkId)
    } catch (error) {
      console.error("Error getting user by clerk ID:", error)
      return null
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      return await this.userRepository.findAll()
    } catch (error) {
      console.error("Error getting all users:", error)
      return []
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      return await this.userRepository.findById(id)
    } catch (error) {
      console.error("Error getting user by ID:", error)
      return null
    }
  }

  async updateUser(
    clerkId: string,
    userData: Partial<User>,
  ): Promise<User | null> {
    try {
      // Primero encontrar el usuario por clerkId
      const existingUser = await this.userRepository.findByClerkId(clerkId)

      if (!existingUser) {
        throw new Error("User not found")
      }

      // Actualizar el usuario
      const updatedUser = await this.userRepository.update(
        existingUser.id,
        userData,
      )

      return updatedUser
    } catch (error) {
      console.error("Error updating user:", error)
      return null
    }
  }

  async updateUserRole(userId: string, role: string): Promise<User | null> {
    try {
      // Primero encontrar el usuario por ID
      const existingUser = await this.userRepository.findById(userId)

      if (!existingUser) {
        throw new Error("User not found")
      }

      // @ts-ignore
      const updatedUser = await this.userRepository.update(userId, { role })

      return updatedUser
    } catch (error) {
      console.error("Error updating user role:", error)
      return null
    }
  }

  async deleteUser(userId: string): Promise<boolean> {
    try {
      await this.userRepository.delete(userId)
      return true
    } catch (error) {
      console.error("Error deleting user:", error)
      return false
    }
  }
}
