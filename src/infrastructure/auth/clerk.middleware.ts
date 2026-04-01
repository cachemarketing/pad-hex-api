// clerk.middleware.ts
import { Request, Response, NextFunction } from "express"
import { clerkMiddleware, getAuth } from "@clerk/express"
import { TursoUserRepository } from "../repositories/TursoUserRepository"
import { UserSyncService } from "../../application/services/UserSyncService"
import { User } from "../../domain/entities/User.entity"

// Definir interfaz extendida para Request
interface AuthenticatedRequest extends Request {
  userId?: string
  user?: User
  clerkAuth?: ReturnType<typeof getAuth> // Cambiar nombre para evitar conflicto
}

// Usar el middleware oficial de Clerk
export const requireAuth = clerkMiddleware()

// Middleware personalizado que también sincroniza el usuario con nuestra DB
export const syncUser = () => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      // ✅ Usar getAuth, NO req.auth
      const auth = getAuth(req)

      if (auth && auth.userId) {
        // Sincronizar usuario con nuestra base de datos
        const userRepository = new TursoUserRepository()
        const userSyncService = new UserSyncService(userRepository)

        const syncedUser = await userSyncService.syncUserFromClerk(auth.userId)

        if (syncedUser) {
          req.userId = syncedUser.clerkId
          req.user = syncedUser
          req.clerkAuth = auth // Guardar auth con otro nombre
        }
      } else {
        console.log("No valid auth from Clerk")
      }

      next()
    } catch (error) {
      console.error("Error syncing user:", error)
      next()
    }
  }
}

// Middleware combinado: autenticación + sincronización
export const authMiddleware = () => {
  return [requireAuth, syncUser()]
}

// Helper para obtener el usuario autenticado en rutas
export const getAuthUser = (req: Request) => {
  return getAuth(req)
}

// Helper para obtener el usuario de nuestra DB
export const getCurrentUser = (req: AuthenticatedRequest): User | undefined => {
  return req.user
}

// Middleware para verificar roles específicos
export const requireRole = (roles: string[]) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      // ✅ Usar getAuth, NO req.auth
      const auth = getAuth(req)

      if (!auth || !auth.userId) {
        return res.status(401).json({
          success: false,
          error: "No autenticado",
        })
      }

      // Obtener usuario de nuestra DB (ya debería estar sincronizado)
      const userRepository = new TursoUserRepository()
      const user = await userRepository.findByClerkId(auth.userId)

      if (!user) {
        return res.status(401).json({
          success: false,
          error: "Usuario no encontrado",
        })
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          error: `Acceso denegado. Se requiere rol: ${roles.join(", ")}`,
        })
      }

      // Adjuntar usuario al request para uso posterior
      req.user = user
      req.userId = user.clerkId
      req.clerkAuth = auth

      next()
    } catch (error) {
      console.error("Error checking role:", error)
      return res.status(500).json({
        success: false,
        error: "Error verificando permisos",
      })
    }
  }
}

// Middleware para requerir autenticación y tener usuario sincronizado
export const requireAuthWithUser = () => {
  return [requireAuth, syncUser()]
}
