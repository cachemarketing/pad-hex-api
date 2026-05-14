import { Router } from "express"
import { UserController } from "../controller/user.controller"
import {
  checkAuth,
  requireRole,
} from "../../../../../shared/infrastructure/http/express/middleware/clerk.middleware"
import { onlyAdminRole } from "../../../../../shared/infrastructure/config/role.const"

export { Router } from "express"

export const userRouter = Router()

const controller = new UserController()

userRouter.get("/", requireRole(onlyAdminRole), controller.findByAll)
userRouter.get("/me", checkAuth, controller.findMe)
userRouter.get("/:id", controller.findById)
userRouter.put("/me", controller.update)
