import { Router } from "express"
import { UserController } from "../controllers/UserController"
import { UserSyncService } from "../../application/services/UserSyncService"
import { requireRole } from "../auth/clerk.middleware"
import { onlyAdminRole } from "../auth/role.const"

export const createUserRoutes = (userSyncService: UserSyncService): Router => {
  const router = Router()
  const controller = new UserController(userSyncService)

  router.get("/users/me", controller.getCurrentUser)
  router.get("/users", controller.getAllUsers)
  router.get("/users/:id", controller.getUserById)
  router.put("/users/me", controller.updateCurrentUser)
  router.put(
    "/users/:id/role",
    requireRole(onlyAdminRole),
    controller.updateUserRole,
  )
  router.post("/users/sync", controller.syncUsers)
  router.delete("/users/:id", requireRole(onlyAdminRole), controller.deleteUser)

  return router
}
