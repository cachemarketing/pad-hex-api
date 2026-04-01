import { Router } from "express"
import { UserController } from "../controllers/UserController"
import { UserSyncService } from "../../application/services/UserSyncService"

export const createUserRoutes = (userSyncService: UserSyncService): Router => {
  const router = Router()
  const controller = new UserController(userSyncService)

  // Rutas de usuarios
  router.get("/users/me", controller.getCurrentUser)
  router.get("/users", controller.getAllUsers)
  router.get("/users/:id", controller.getUserById)
  router.put("/users/me", controller.updateCurrentUser)
  router.put("/users/:id/role", controller.updateUserRole)
  router.post("/users/sync", controller.syncUsers)
  router.delete("/users/:id", controller.deleteUser)

  return router
}
