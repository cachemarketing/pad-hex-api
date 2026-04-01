import { Router } from "express"
import { AuthController } from "../controllers/AuthController"

export const createAuthRoutes = (): Router => {
  const router = Router()
  const authController = new AuthController()

  router.get("/auth/me", authController.getCurrentUser)
  router.post("/auth/verify", authController.verifyToken)

  return router
}
