import { Router } from "express"
import { CategoryController } from "../controllers/CategoryController"
import { CategoryService } from "../../application/services/CategoryService"
import { requireAuthWithUser, requireRole } from "../auth/clerk.middleware"
import { adminAndWriterRole, onlyAdminRole } from "../auth/role.const"

export const createCategoryRoutes = (
  categoryService: CategoryService,
): Router => {
  const router = Router()
  const controller = new CategoryController(categoryService)

  router.post(
    "/categories",
    requireAuthWithUser(),
    requireRole(adminAndWriterRole),
    controller.createCategory,
  )
  router.get("/categories", controller.getAllCategories)
  router.get("/categories/:id", controller.getCategory)
  router.put(
    "/categories/:id",
    requireAuthWithUser(),
    requireRole(onlyAdminRole),
    controller.updateCategory,
  )
  router.delete(
    "/categories/:id",
    requireAuthWithUser(),
    requireRole(onlyAdminRole),
    controller.deleteCategory,
  )

  return router
}
