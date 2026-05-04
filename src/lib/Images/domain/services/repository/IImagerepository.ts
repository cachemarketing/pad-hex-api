export interface IImage {
  id: string
  url: string
  key: string
  bucket: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  width?: number
  height?: number
  uploadedBy: string
  createdAt: Date
}

export interface IImageRepository {
  save(image: IImage): Promise<IImage>
  findById(id: string): Promise<IImage | null>
  findByKey(key: string): Promise<IImage | null>
  delete(id: string): Promise<void>
}
