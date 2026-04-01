import { Router } from "express"
import { CategoryController } from "../controllers/CategoryController"
import { CategoryService } from "../../application/services/CategoryService"
import { requireAuth } from "../auth/clerk.middleware"

export const createCategoryRoutes = (
  categoryService: CategoryService,
): Router => {
  const router = Router()
  const controller = new CategoryController(categoryService)

  // Rutas protegidas (requieren autenticación)
  router.post("/categories", requireAuth, controller.createCategory)
  router.get("/categories", controller.getAllCategories)
  router.get("/categories/:id", controller.getCategory)
  router.put("/categories/:id", requireAuth, controller.updateCategory)
  router.delete("/categories/:id", requireAuth, controller.deleteCategory)

  return router
}
