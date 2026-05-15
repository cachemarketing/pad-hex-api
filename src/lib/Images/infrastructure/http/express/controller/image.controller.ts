import { Request, Response } from "express"
import { UploadedFile } from "express-fileupload"
import { ImageService } from "../../../../application/services/ImageServices"

export class UploadController {
  constructor(private imageService: ImageService) {}

  uploadFeaturedImage = async (req: Request, res: Response): Promise<void> => {
    try {
      //@ts-ignore
      const user = req.user
      if (!user) {
        res.status(401).json({ success: false, error: "No autenticado" })
        return
      }

      const file = req.files?.featuredImg as UploadedFile
      if (!file) {
        res
          .status(400)
          .json({ success: false, error: "No se ha subido ningún archivo" })
        return
      }

      // Opciones de procesamiento
      const options = {
        resize: { width: 1200, height: 630 }, // Tamaño óptimo para featured images
        quality: 80, // Comprimir al 80% de calidad
      }

      const result = await this.imageService.uploadImage(
        file.data,
        file.name,
        file.mimetype,
        user.id.value,
        options,
      )

      res.status(200).json({
        success: true,
        data: {
          url: result.avifUrl,
          key: result.avifKey,
          filename: result.filename,
          size: result.size,
          ogImg: result.url,
          avifKey: result.key,
        },
        message: "Imagen subida exitosamente",
      })
    } catch (error: any) {
      console.error("Error uploading image:", error)
      res.status(500).json({ success: false, error: error.message })
    }
  }

  deleteImage = async (req: Request, res: Response): Promise<void> => {
    try {
      //@ts-ignore
      const user = req.user
      if (!user) {
        res.status(401).json({ success: false, error: "No autenticado" })
        return
      }

      const { key } = req.params
      if (!key) {
        res
          .status(400)
          .json({ success: false, error: "Key de imagen requerida" })
        return
      }

      await this.imageService.deleteImage(key)
      res.status(200).json({ success: true, message: "Imagen eliminada" })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  }
}
