export interface IImageUploadResult {
  id: string
  url: string
  key: string
  bucket: string
  filename: string
  size: number
  mimeType: string
  avifUrl?: string
  avifKey?: string
}

export interface IImageStorageService {
  uploadImage(
    file: Buffer,
    originalName: string,
    mimeType: string,
    userId: string,
    options?: {
      resize?: { width: number; height: number }
      quality?: number
    },
  ): Promise<IImageUploadResult>

  deleteImage(key: string): Promise<void>
  getImageUrl(key: string): string
  imageExists(key: string): Promise<boolean>
}
