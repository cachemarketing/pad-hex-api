import { Router } from "express"
import {
  validateFileSize,
  validateFileUpload,
} from "../../../../../shared/infrastructure/http/express/middleware/upload.middleware"
import { UploadController } from "../controller/image.controller"
import { ImageService } from "../../../../application/services/ImageServices"
import {
  authMiddleware,
  checkAuth,
} from "../../../../../shared/infrastructure/http/express/middleware/clerk.middleware"

export const createUploadRoutes = (imageService: ImageService): Router => {
  const router = Router()
  const controller = new UploadController(imageService)
  const [getAuthUser] = authMiddleware()
  router.use(getAuthUser)

  // Subir imagen destacada
  router.post(
    "/upload/featured",
    validateFileUpload,
    validateFileSize(10), // 10MB máximo
    checkAuth,
    controller.uploadFeaturedImage,
  )

  // Eliminar imagen por key
  router.delete("/upload/:key", controller.deleteImage)

  return router
}
