import { IImageStorageService } from "../../domain/services/IImageStorageService"
import { IImageRepository } from "../../domain/repositories/IImageRepository"

export class ImageService {
  constructor(
    private imageStorageService: IImageStorageService,
    private imageRepository: IImageRepository,
  ) {}

  async uploadImage(
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string,
    userId: string,
    options?: {
      resize?: { width: number; height: number }
      quality?: number
    },
  ) {
    return await this.imageStorageService.uploadImage(
      fileBuffer,
      originalName,
      mimeType,
      userId,
      options,
    )
  }

  async deleteImage(key: string): Promise<void> {
    await this.imageStorageService.deleteImage(key)
  }

  async getImageUrl(key: string): Promise<string> {
    return this.imageStorageService.getImageUrl(key)
  }

  async getImageInfo(id: string) {
    return await this.imageRepository.findById(id)
  }
}
