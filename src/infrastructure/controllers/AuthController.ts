import { Request, Response } from "express"
import { getAuth } from "@clerk/express"
import { TursoUserRepository } from "../repositories/TursoUserRepository"

export class AuthController {
  private userRepository: TursoUserRepository

  constructor() {
    this.userRepository = new TursoUserRepository()
  }

  // ✅ Endpoint simplificado - el middleware ya verificó el token
  getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const auth = getAuth(req)

      if (!auth || !auth.userId) {
        res.status(401).json({ success: false, error: "No autenticado" })
        return
      }

      const user = await this.userRepository.findByClerkId(auth.userId)

      if (!user) {
        res.status(404).json({ success: false, error: "Usuario no encontrado" })
        return
      }

      res.status(200).json({
        success: true,
        data: {
          id: user.id,
          clerkId: user.clerkId,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          isActive: user.isActive,
        },
      })
    } catch (error: any) {
      console.error("Error getting current user:", error)
      res.status(500).json({ success: false, error: error.message })
    }
  }

  // ✅ Verificar token (ahora solo devuelve info del auth)
  verifyToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const auth = getAuth(req)

      if (!auth || !auth.userId) {
        res.status(401).json({ success: false, error: "Token inválido" })
        return
      }

      const user = await this.userRepository.findByClerkId(auth.userId)

      if (!user) {
        res.status(404).json({ success: false, error: "Usuario no encontrado" })
        return
      }

      res.status(200).json({
        success: true,
        data: {
          id: user.id,
          clerkId: user.clerkId,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          isActive: user.isActive,
        },
      })
    } catch (error: any) {
      console.error("Error verifying token:", error)
      res.status(500).json({ success: false, error: error.message })
    }
  }
}
