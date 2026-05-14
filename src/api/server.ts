import express from "express"
import cors from "cors"
import helmet from "helmet"
import dotenv from "dotenv"
import morgan from "morgan"
import { apiRouter } from "../lib/shared/infrastructure/http/express/routes/api.routes"
import { TursoDatabase } from "../lib/shared/infrastructure/database/turso.db"
import { uploadMiddleware } from "../lib/shared/infrastructure/http/express/middleware/upload.middleware"
import { S3ImageRepository } from "../lib/Images/infrastructure/storage/S3ImageRepository"
import { S3ImageStorageService } from "../lib/Images/infrastructure/storage/S3ImageStorageService"
import { ImageService } from "../lib/Images/application/services/ImageServices"
import { createUploadRoutes } from "../lib/Images/infrastructure/http/express/routes/image.routes"
import { clerkMiddleware } from "@clerk/express"

dotenv.config()

export class Server {
  private app: express.Application
  private port: number | string

  constructor(port: number | string = 3500) {
    this.app = express()
    this.port = port
    this.setupMiddleware()
    this.setupRoutes()
  }

  // server.ts o donde tengas la configuración del Server
  private setupMiddleware(): void {
    const origins = process.env.ACCEPTED_ORIGIN
      ? process.env.ACCEPTED_ORIGIN.split(",").map((o) => o.trim())
      : []

    // Log para debugging
    console.log("🔧 CORS Origins configurados:", origins)
    console.log("🌍 NODE_ENV:", process.env.NODE_ENV)

    const corsOptions = {
      origin: (
        origin: string | undefined,
        callback: (err: Error | null, allow?: boolean) => void,
      ) => {
        // Permitir peticiones sin origen (como Postman, scripts locales)
        if (!origin) return callback(null, true)

        // En desarrollo, permitir localhost
        if (process.env.NODE_ENV !== "production") {
          return callback(null, true)
        }

        // En producción, verificar contra la lista blanca
        if (origins.includes(origin)) {
          callback(null, true)
        } else {
          console.error(
            `❌ CORS bloqueado: ${origin} no está en la lista blanca`,
          )
          callback(new Error(`Origen ${origin} no permitido por CORS`))
        }
      },
      methods: "GET,POST,PUT,DELETE,OPTIONS,PATCH",
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Accept",
      ],
      exposedHeaders: ["Content-Length", "X-Request-Id"],
      credentials: true,
      optionsSuccessStatus: 200,
      maxAge: 86400, // 24 horas cache para preflight
    }

    // Helmet debe ir ANTES que CORS para producción
    this.app.use(
      helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" },
        crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
      }),
    )

    this.app.use(cors(corsOptions))

    this.app.options("*", cors(corsOptions))

    this.app.use(express.json({ limit: "10mb" }))
    this.app.use(express.urlencoded({ extended: true, limit: "10mb" }))

    this.app.use(uploadMiddleware)
    this.app.use(morgan("dev"))

    // Middleware para debuggear CORS
    this.app.use((req, res, next) => {
      console.log(
        `📡 ${req.method} ${req.path} - Origin: ${req.headers.origin || "no origin"}`,
      )
      if (req.method === "OPTIONS") {
        console.log("🔄 Preflight request recibida")
      }
      next()
    })
  }

  private setupRoutes(): void {
    this.app.get("/health", async (req, res) => {
      try {
        // No esperar la base de datos si tarda
        const dbStatus = await Promise.race([
          TursoDatabase.getInstance(),
          new Promise((resolve) => setTimeout(() => resolve("timeout"), 2000)),
        ])

        res.status(200).json({
          status: "OK",
          timestamp: new Date().toISOString(),
          database: dbStatus === "timeout" ? "checking" : "connected",
          port: this.port,
        })
      } catch (error) {
        res.status(200).json({
          status: "OK",
          timestamp: new Date().toISOString(),
          database: "error",
          port: this.port,
        })
      }
    })

    this.app.get("/ready", (req, res) => {
      res.status(200).json({ status: "ready" })
    })

    // Liveness probe
    this.app.get("/live", (req, res) => {
      res.status(200).json({ status: "alive" })
    })

    const imageRepository = new S3ImageRepository()

    const imageStorageService = new S3ImageStorageService(imageRepository)

    const imageService = new ImageService(imageStorageService, imageRepository)
    const uploadRoutes = createUploadRoutes(imageService)
    this.app.use("/api", apiRouter)
    this.app.use("/api", uploadRoutes)
  }

  async start(): Promise<void> {
    try {
      console.log("🔄 Inicializando base de datos...")
      await TursoDatabase.getInstance().initialize()
      console.log("✅ Base de datos inicializada")

      this.app.listen(this.port, () => {
        console.log(`🚀 Servidor corriendo en ${this.port}`)
        console.log(`📸 Subida de imágenes a S3 configurada`)
      })

      return Promise.resolve()
    } catch (error) {
      console.error("❌ Error al iniciar el servidor:", error)
      throw error
    }
  }
}
