// clerk.middleware.ts
import { Request, Response, NextFunction } from "express"
import { getAuth } from "@clerk/express"
import { TursoUserRepository } from "../repositories/TursoUserRepository"
import { UserSyncService } from "../../application/services/UserSyncService"
import { User } from "../../domain/entities/User.entity"
import dotenv from "dotenv"
dotenv.config()

interface AuthenticatedRequest extends Request {
  userId?: string
  user?: User
  clerkAuth?: ReturnType<typeof getAuth>
}

// Middleware simple sin el middleware oficial que puede fallar
export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const auth = getAuth(req)

    if (!auth || !auth.userId) {
      return res.status(401).json({
        success: false,
        error: "No autenticado",
      })
    }

    next()
  } catch (error) {
    console.error("Error en autenticación:", error)
    return res.status(401).json({
      success: false,
      error: "Error de autenticación",
    })
  }
}

// Middleware para sincronizar usuario
export const syncUser = () => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const auth = getAuth(req)

      if (auth && auth.userId) {
        const userRepository = new TursoUserRepository()
        const userSyncService = new UserSyncService(userRepository)

        // Hacer sync en background sin await
        userSyncService
          .syncUserFromClerk(auth.userId)
          .then((syncedUser) => {
            if (syncedUser) {
              req.userId = syncedUser.clerkId
              req.user = syncedUser
              req.clerkAuth = auth
            }
          })
          .catch((error) => {
            console.error("Error syncing user in background:", error)
          })
      }

      next()
    } catch (error) {
      console.error("Error in sync middleware:", error)
      next()
    }
  }
}

export const authMiddleware = () => {
  return [requireAuth, syncUser()]
}

export const getAuthUser = (req: Request) => {
  return getAuth(req)
}

export const getCurrentUser = (req: AuthenticatedRequest): User | undefined => {
  return req.user
}

export const requireRole = (roles: string[]) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const auth = getAuth(req)

      if (!auth || !auth.userId) {
        return res.status(401).json({
          success: false,
          error: "No autenticado",
        })
      }

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

export const requireAuthWithUser = () => {
  return [requireAuth, syncUser()]
}
