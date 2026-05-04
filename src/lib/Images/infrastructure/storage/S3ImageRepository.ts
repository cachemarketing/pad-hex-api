import { TursoDatabase } from "../../../shared/infrastructure/database/turso.db"
import {
  IImage,
  IImageRepository,
} from "../../domain/services/repository/IImagerepository"

export class S3ImageRepository implements IImageRepository {
  private db = TursoDatabase.getInstance().getClient()

  async save(image: IImage): Promise<IImage> {
    await this.db.execute({
      sql: `INSERT INTO images (
        id, url, key, bucket, filename, originalName, 
        mimeType, size, width, height, uploadedBy, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        image.id,
        image.url,
        image.key,
        image.bucket,
        image.filename,
        image.originalName,
        image.mimeType,
        image.size,
        image.width || null,
        image.height || null,
        image.uploadedBy,
        image.createdAt.toISOString(),
      ],
    })

    return image
  }

  async findById(id: string): Promise<IImage | null> {
    const result = await this.db.execute({
      sql: "SELECT * FROM images WHERE id = ?",
      args: [id],
    })

    if (result.rows.length === 0) return null
    return this.mapToImage(result.rows[0])
  }

  async findByKey(key: string): Promise<IImage | null> {
    const result = await this.db.execute({
      sql: "SELECT * FROM images WHERE key = ?",
      args: [key],
    })

    if (result.rows.length === 0) return null
    return this.mapToImage(result.rows[0])
  }

  async delete(id: string): Promise<void> {
    await this.db.execute({
      sql: "DELETE FROM images WHERE id = ?",
      args: [id],
    })
  }

  private mapToImage(row: any): IImage {
    return {
      id: row.id,
      url: row.url,
      key: row.key,
      bucket: row.bucket,
      filename: row.filename,
      originalName: row.originalName,
      mimeType: row.mimeType,
      size: row.size,
      width: row.width,
      height: row.height,
      uploadedBy: row.uploadedBy,
      createdAt: new Date(row.createdAt),
    }
  }
}
