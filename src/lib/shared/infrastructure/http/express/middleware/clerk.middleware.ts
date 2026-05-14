import { Request, Response, NextFunction } from "express"
import { clerkMiddleware, getAuth, clerkClient } from "@clerk/express" // ← ya NO importar clerkMiddleware
import { User } from "../../../../../User/domain/entity/user.entity"
import { serviceContainer } from "../../../services/serviceContainer"

export interface AuthenticatedRequest extends Request {
  userId?: string
  user?: User
  clerkAuth?: ReturnType<typeof getAuth>
}
export const requireAuth = clerkMiddleware({
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.CLERK_SECRET_KEY,
})

export const authMiddleware = () => {
  return [requireAuth, getAuthUser]
}

export const getAuthUser = (req: Request) => getAuth(req)

export const getCurrentUser = (req: AuthenticatedRequest): User | undefined => {
  return req.user
}

export const requireRole = (roles: string[]) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const auth = getAuth(req as Request)

      if (!auth?.userId) {
        res.status(401).json({ success: false, error: "No autenticado" })
        return
      }

      const user = await serviceContainer.user.findByClerkId.run(auth.userId)

      if (!user) {
        res.status(401).json({ success: false, error: "Usuario no encontrado" })
        return
      }

      if (!user.isActive.value) {
        res.status(403).json({ success: false, error: "Usuario inactivo" })
        return
      }

      if (!roles.includes(user.role)) {
        res.status(403).json({
          success: false,
          error: `Acceso denegado. Se requiere rol: ${roles.join(", ")}`,
        })
        return
      }

      req.user = user
      req.userId = user.clerkId.value
      req.clerkAuth = auth

      next()
    } catch (error) {
      console.error("Error checking role:", error)
      res
        .status(500)
        .json({ success: false, error: "Error verificando permisos" })
    }
  }
}

export const checkAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { isAuthenticated, userId } = getAuth(req)

  if (!isAuthenticated) {
    return res.status(401).json({ error: "User not authenticated" })
  }

  const user = await serviceContainer.user.findByClerkId.run(userId)
  //@ts-ignore
  req.user = { ...user }
  next()
}
