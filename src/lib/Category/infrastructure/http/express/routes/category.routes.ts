import { Router } from "express"
import { CategoryController } from "../controller/category.controller"
import { adminAndWriterRole } from "../../../../../shared/infrastructure/config/role.const"
import {
  checkAuth,
  requireRole,
} from "../../../../../shared/infrastructure/http/express/middleware/clerk.middleware"

export const categoryRouter = Router()

const controller = new CategoryController()

categoryRouter.post(
  "/",
  checkAuth,
  requireRole(adminAndWriterRole),
  controller.save,
)
categoryRouter.get("/", controller.findAll)
categoryRouter.get("/:id", controller.findById)
categoryRouter.put(
  "/:id",
  checkAuth,
  requireRole(adminAndWriterRole),
  controller.update,
)
