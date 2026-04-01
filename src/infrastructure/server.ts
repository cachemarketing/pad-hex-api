import express from "express"
import cors from "cors"
import helmet from "helmet"
import { uploadMiddleware } from "./middleware/upload.middleware"
import { authMiddleware } from "./auth/clerk.middleware"
import { createPostRoutes } from "./routes/post.routes"
import { createCategoryRoutes } from "./routes/category.routes"
import { createUserRoutes } from "./routes/user.routes"
import { createAuthRoutes } from "./routes/auth.routes"
import { createUploadRoutes } from "./routes/upload.routes"
import { PostService } from "../application/services/PostService"
import { CategoryService } from "../application/services/CategoryService"
import { ImageService } from "../application/services/ImageService"
import { UserSyncService } from "../application/services/UserSyncService"
import { TursoPostRepository } from "./repositories/TursoPostRepository"
import { TursoCategoryRepository } from "./repositories/TursoCategoryRepository"
import { TursoUserRepository } from "./repositories/TursoUserRepository"
import { S3ImageRepository } from "./storage/s3/S3ImageRepository"
import { S3ImageStorageService } from "./storage/s3/S3ImageStorageService"
import { TursoDatabase } from "./database/turso.database"
import dotenv from "dotenv"
import morgan from "morgan"

dotenv.config()

// server.ts
export class Server {
  private app: express.Application
  private port: number

  constructor(port: number = 3000) {
    this.app = express()
    this.port = port
    this.setupMiddleware()
    this.setupRoutes()
  }

  private setupMiddleware(): void {
    this.app.use(helmet())
    this.app.use(cors())
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(uploadMiddleware)
    this.app.use(morgan("dev"))

    // ⚠️ IMPORTANTE: No aplicar authMiddleware globalmente
    // En lugar de esto:
    // const [clerkAuth, userSync] = authMiddleware()
    // this.app.use(clerkAuth)
    // this.app.use(userSync)

    // Mejor: Aplicar solo a rutas específicas
  }

  private setupRoutes(): void {
    // Repositorios
    const postRepository = new TursoPostRepository()
    const categoryRepository = new TursoCategoryRepository()
    const userRepository = new TursoUserRepository()
    const imageRepository = new S3ImageRepository()

    // Servicios de almacenamiento
    const imageStorageService = new S3ImageStorageService(imageRepository)

    // Servicios de aplicación
    const imageService = new ImageService(imageStorageService, imageRepository)
    const postService = new PostService(
      postRepository,
      categoryRepository,
      userRepository,
    )
    const categoryService = new CategoryService(
      categoryRepository,
      userRepository,
    )
    const userSyncService = new UserSyncService(userRepository)

    // Rutas
    const postRoutes = createPostRoutes(postService)
    const categoryRoutes = createCategoryRoutes(categoryService)
    const userRoutes = createUserRoutes(userSyncService)
    const authRoutes = createAuthRoutes()
    const uploadRoutes = createUploadRoutes(imageService)

    // Health check (público)
    this.app.get("/health", async (req, res) => {
      const dbConnected = await TursoDatabase.getInstance()
      res.status(200).json({
        status: "OK",
        timestamp: new Date(),
        database: dbConnected ? "connected" : "disconnected",
      })
    })

    // Rutas públicas (sin autenticación)
    this.app.use("/api/auth", authRoutes)

    // ✅ Aplicar middleware de autenticación SOLO a rutas protegidas
    const [clerkAuth, userSync] = authMiddleware()

    this.app.use("/api", postRoutes)
    this.app.use("/api", clerkAuth, userSync, categoryRoutes)
    this.app.use("/api", clerkAuth, userSync, userRoutes)
    this.app.use("/api", clerkAuth, userSync, uploadRoutes)
  }

  async start(): Promise<void> {
    try {
      await TursoDatabase.getInstance().initialize()
      await this.createImagesTable()
      await this.createUsersTable()

      const userRepository = new TursoUserRepository()
      const userSyncService = new UserSyncService(userRepository)
      await userSyncService.syncAllUsers()

      this.app.listen(this.port, () => {
        console.log(`🚀 Servidor corriendo en http://localhost:${this.port}`)
        console.log(`📸 Subida de imágenes a S3 configurada`)
      })
    } catch (error) {
      console.error("Error al iniciar el servidor:", error)
      throw error
    }
  }

  private async createImagesTable(): Promise<void> {
    const db = TursoDatabase.getInstance().getClient()
    await db.execute(`
      CREATE TABLE IF NOT EXISTS images (
        id TEXT PRIMARY KEY,
        url TEXT NOT NULL,
        key TEXT UNIQUE NOT NULL,
        bucket TEXT NOT NULL,
        filename TEXT NOT NULL,
        originalName TEXT NOT NULL,
        mimeType TEXT NOT NULL,
        size INTEGER NOT NULL,
        width INTEGER,
        height INTEGER,
        uploadedBy TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (uploadedBy) REFERENCES users(id) ON DELETE CASCADE
      )
    `)
    console.log("  ✓ Tabla images creada")
  }

  private async createUsersTable(): Promise<void> {
    const db = TursoDatabase.getInstance().getClient()
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        clerkId TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        name TEXT,
        role TEXT DEFAULT 'user',
        imageUrl TEXT,
        isActive INTEGER DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log("  ✓ Tabla users creada")
  }
}
