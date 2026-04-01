import { Request, Response, NextFunction } from "express"
import fileUpload from "express-fileupload"

// Configuración de express-fileupload
export const uploadMiddleware = fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB máximo
  useTempFiles: false,
  abortOnLimit: true,
  createParentPath: true,
  debug: process.env.NODE_ENV === "development",
})

// Middleware para validar que se subió un archivo
export const validateFileUpload = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      success: false,
      error: "No se ha subido ningún archivo",
    })
  }

  const file = req.files.featuredImg || req.files.image

  if (!file) {
    return res.status(400).json({
      success: false,
      error: 'El campo "featuredImg" es requerido',
    })
  }

  // Validar tipo de archivo
  const allowedMimes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ]
  //@ts-ignore
  if (!allowedMimes.includes(file.mimetype)) {
    return res.status(400).json({
      success: false,
      error: "Formato de imagen no permitido. Use: JPG, PNG, WEBP o GIF",
    })
  }

  next()
}

// Middleware para validar tamaño
export const validateFileSize = (maxSizeMB: number = 10) => {
  return (req: Request, res: Response, next: NextFunction) => {
    //@ts-ignore
    const file = req.files?.featuredImg || req.files?.image

    //@ts-ignore
    if (file && file.size > maxSizeMB * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        error: `El archivo no debe exceder los ${maxSizeMB}MB`,
      })
    }

    next()
  }
}
