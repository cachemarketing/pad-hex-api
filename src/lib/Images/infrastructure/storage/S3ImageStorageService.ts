import sharp from "sharp"
import { v4 as uuidv4 } from "uuid"

import { S3Client } from "./S3Client"
import {
  IImageStorageService,
  IImageUploadResult,
} from "../../domain/services/IImageStorageServices"
import { IImageRepository } from "../../domain/services/repository/IImagerepository"

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
      const baseId = uuidv4()
      const basePath = `posts/${userId}`

      // Pipeline base con resize opcional
      let pipeline = sharp(file)
      if (options?.resize) {
        pipeline = pipeline.resize(
          options.resize.width,
          options.resize.height,
          {
            fit: "cover",
            position: "center",
          },
        )
      }

      const quality = options?.quality ?? 80

      // ── JPG ──────────────────────────────────────────────────────────────
      const jpgBuffer = await pipeline
        .clone()
        .jpeg({ quality, progressive: true })
        .toBuffer()

      const jpgFilename = `${baseId}.jpg`
      const jpgKey = `${basePath}/${jpgFilename}`
      const jpgUrl = await this.s3Client.uploadFile(
        jpgKey,
        jpgBuffer,
        "image/jpeg",
      )

      // ── AVIF ─────────────────────────────────────────────────────────────
      const avifBuffer = await pipeline
        .clone()
        .avif({ quality, effort: 4 }) // effort 4 = buen balance velocidad/compresión
        .toBuffer()

      const avifFilename = `${baseId}.avif`
      const avifKey = `${basePath}/${avifFilename}`
      const avifUrl = await this.s3Client.uploadFile(
        avifKey,
        avifBuffer,
        "image/avif",
      )

      // ── Metadata ─────────────────────────────────────────────────────────
      const metadata = await pipeline.clone().metadata()

      // ── Persistencia (registro principal = JPG) ──────────────────────────
      const imageRecord: IImageUploadResult = {
        id: baseId,
        url: jpgUrl,
        key: jpgKey,
        bucket: this.s3Client.getBucket(),
        filename: jpgFilename,
        size: jpgBuffer.length,
        mimeType: "image/jpeg",
        avifUrl,
        avifKey,
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
      // Intentar borrar también la variante AVIF derivada del mismo baseId
      const avifKey = key.replace(/\.jpg$/, ".avif")

      await Promise.allSettled([
        this.s3Client.deleteFile(key),
        this.s3Client.deleteFile(avifKey),
      ])

      await this.s3Client.invalidateCache([`/${key}`, `/${avifKey}`])

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
