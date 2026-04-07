// category.routes.ts
import { Router } from "express"
import { CategoryController } from "../controllers/CategoryController"
import { CategoryService } from "../../application/services/CategoryService"
import { requireAuthWithUser } from "../auth/clerk.middleware"

export const createCategoryRoutes = (
  categoryService: CategoryService,
): Router => {
  const router = Router()
  const controller = new CategoryController(categoryService)

  // Usar el middleware combinado que ya incluye auth + sync
  router.post("/categories", requireAuthWithUser(), controller.createCategory)
  router.get("/categories", controller.getAllCategories)
  router.get("/categories/:id", controller.getCategory)
  router.put(
    "/categories/:id",
    requireAuthWithUser(),
    controller.updateCategory,
  )
  router.delete(
    "/categories/:id",
    requireAuthWithUser(),
    controller.deleteCategory,
  )

  return router
}
