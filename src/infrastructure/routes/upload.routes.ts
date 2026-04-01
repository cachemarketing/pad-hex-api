import { Router } from "express"
import { UploadController } from "../controllers/UploadController"
import { ImageService } from "../../application/services/ImageService"
import {
  validateFileUpload,
  validateFileSize,
} from "../middleware/upload.middleware"

export const createUploadRoutes = (imageService: ImageService): Router => {
  const router = Router()
  const controller = new UploadController(imageService)

  // Subir imagen destacada
  router.post(
    "/upload/featured",
    validateFileUpload,
    validateFileSize(10), // 10MB máximo
    controller.uploadFeaturedImage,
  )

  // Eliminar imagen por key
  router.delete("/upload/:key", controller.deleteImage)

  return router
}
