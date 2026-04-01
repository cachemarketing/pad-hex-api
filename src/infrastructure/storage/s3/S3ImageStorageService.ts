import sharp from "sharp"
import { v4 as uuidv4 } from "uuid"
import {
  IImageStorageService,
  IImageUploadResult,
} from "../../../domain/services/IImageStorageService"
import { IImageRepository } from "../../../domain/repositories/IImageRepository"
import { S3Client } from "./S3Client"

export class S3ImageStorageService implements IImageStorageService {
  private s3Client: S3Client

  constructor(private imageRepository: IImageRepository) {
    this.s3Client = S3Client.getInstance()
  }

  async uploadImage(
    file: Buffer,
    originalName: string,
    mimeType: string,
    userId: string,
    options?: {
      resize?: { width: number; height: number }
      quality?: number
    },
  ): Promise<IImageUploadResult> {
    try {
      // Procesar imagen con sharp
      let processedImage = sharp(file)
      let metadata = await sharp(file).metadata()

      // Redimensionar si se solicita
      if (options?.resize) {
        processedImage = processedImage.resize(
          options.resize.width,
          options.resize.height,
          {
            fit: "cover",
            position: "center",
          },
        )
        metadata = await processedImage.metadata()
      }

      // Comprimir si se solicita
      let imageBuffer: Buffer
      if (options?.quality && options.quality < 100) {
        imageBuffer = await processedImage
          .jpeg({ quality: options.quality, progressive: true })
          .toBuffer()
      } else {
        imageBuffer = await processedImage.toBuffer()
      }

      // Generar nombre único para el archivo
      const extension = originalName.split(".").pop() || "jpg"
      const filename = `${uuidv4()}.${extension}`
      const key = `posts/${userId}/${filename}`

      // Subir a S3 (retorna URL de CloudFront si está configurado)
      const url = await this.s3Client.uploadFile(key, imageBuffer, mimeType)

      // Guardar referencia en base de datos
      const imageRecord: IImageUploadResult = {
        id: uuidv4(),
        url,
        key,
        bucket: this.s3Client.getBucket(),
        filename,
        size: imageBuffer.length,
        mimeType,
      }

      await this.imageRepository.save({
        ...imageRecord,
        originalName,
        uploadedBy: userId,
        width: metadata.width,
        height: metadata.height,
        createdAt: new Date(),
      })

      return imageRecord
    } catch (error) {
      console.error("Error uploading image to S3:", error)
      throw new Error("Error al subir la imagen")
    }
  }

  async deleteImage(key: string): Promise<void> {
    try {
      await this.s3Client.deleteFile(key)

      // Invalidar caché de CloudFront
      await this.s3Client.invalidateCache([`/${key}`])

      const image = await this.imageRepository.findByKey(key)
      if (image) {
        await this.imageRepository.delete(image.id)
      }
    } catch (error) {
      console.error("Error deleting image from S3:", error)
      throw new Error("Error al eliminar la imagen")
    }
  }

  getImageUrl(key: string): string {
    return this.s3Client.getPublicUrlForKey(key)
  }

  async imageExists(key: string): Promise<boolean> {
    return await this.s3Client.fileExists(key)
  }
}
