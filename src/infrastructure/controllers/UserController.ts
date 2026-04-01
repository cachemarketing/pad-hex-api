import { Request, Response } from "express"
import { UserSyncService } from "../../application/services/UserSyncService"

// Extender Request para incluir user y userId
interface AuthenticatedRequest extends Request {
  userId?: string
  user?: any // o importa tu tipo User
}

export class UserController {
  constructor(private userSyncService: UserSyncService) {}

  getCurrentUser = async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          error: "No autenticado",
        })
      }

      //@ts-ignore
      const user = await this.userSyncService.getUserByClerkId(req.userId)

      if (!user) {
        return res.status(404).json({
          success: false,
          error: "Usuario no encontrado",
        })
      }

      res.json({
        success: true,
        data: user,
      })
    } catch (error) {
      console.error("Error getting current user:", error)
      res.status(500).json({
        success: false,
        error: "Error al obtener el usuario",
      })
    }
  }

  getAllUsers = async (req: Request, res: Response) => {
    try {
      //@ts-ignore
      const users = await this.userSyncService.getAllUsers()
      res.json({
        success: true,
        data: users,
      })
    } catch (error) {
      console.error("Error getting all users:", error)
      res.status(500).json({
        success: false,
        error: "Error al obtener los usuarios",
      })
    }
  }

  getUserById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      //@ts-ignore
      const user = await this.userSyncService.getUserById(id)

      if (!user) {
        return res.status(404).json({
          success: false,
          error: "Usuario no encontrado",
        })
      }

      res.json({
        success: true,
        data: user,
      })
    } catch (error) {
      console.error("Error getting user by id:", error)
      res.status(500).json({
        success: false,
        error: "Error al obtener el usuario",
      })
    }
  }

  updateCurrentUser = async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          error: "No autenticado",
        })
      }

      //@ts-ignore
      const updatedUser = await this.userSyncService.updateUser(
        req.userId,
        req.body,
      )

      res.json({
        success: true,
        data: updatedUser,
      })
    } catch (error) {
      console.error("Error updating user:", error)
      res.status(500).json({
        success: false,
        error: "Error al actualizar el usuario",
      })
    }
  }

  updateUserRole = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params
      const { role } = req.body

      if (!role) {
        return res.status(400).json({
          success: false,
          error: "El rol es requerido",
        })
      }

      //@ts-ignore
      const updatedUser = await this.userSyncService.updateUserRole(id, role)

      res.json({
        success: true,
        data: updatedUser,
      })
    } catch (error) {
      console.error("Error updating user role:", error)
      res.status(500).json({
        success: false,
        error: "Error al actualizar el rol del usuario",
      })
    }
  }

  syncUsers = async (req: Request, res: Response) => {
    try {
      const result = await this.userSyncService.syncAllUsers()
      res.json({
        success: true,
        data: result,
      })
    } catch (error) {
      console.error("Error syncing users:", error)
      res.status(500).json({
        success: false,
        error: "Error al sincronizar usuarios",
      })
    }
  }

  deleteUser = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params
      //@ts-ignore
      await this.userSyncService.deleteUser(id)

      res.json({
        success: true,
        message: "Usuario eliminado correctamente",
      })
    } catch (error) {
      console.error("Error deleting user:", error)
      res.status(500).json({
        success: false,
        error: "Error al eliminar el usuario",
      })
    }
  }
}
