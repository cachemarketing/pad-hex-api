import { createClient, Client } from "@libsql/client"
import dotenv from "dotenv"

dotenv.config()

export class TursoDatabase {
  private static instance: TursoDatabase
  private client: Client
  private initialized = false

  private constructor() {
    this.client = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN,
    })
  }

  static getInstance(): TursoDatabase {
    if (!TursoDatabase.instance) {
      TursoDatabase.instance = new TursoDatabase()
    }
    return TursoDatabase.instance
  }

  getClient(): Client {
    return this.client
  }

  async initialize(): Promise<void> {
    if (this.initialized) return

    try {
      /*  // 1. Tabla de usuarios
      await this.createUsersTable()

      // 2. Tabla de categorías
      await this.createCategoriesTable()

      // 3. Tabla de posts
      await this.createPostsTable()

      await this.createImagesTable()

      await this.createUsersTable()

      // 4. Índices
      await this.createIndexes() */

      this.initialized = true
      console.log("✅ Base de datos Turso inicializada")
    } catch (error) {
      console.error("❌ Error inicializando DB:", error)
      throw error
    }
  }

  private async createImagesTable(): Promise<void> {
    await this.client.execute(`
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
    await this.client.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        clerkId TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'reader',
        avatar TEXT,
        isActive BOOLEAN DEFAULT 1,
        lastLoginAt DATETIME,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log("  ✓ Tabla users creada")
  }

  private async createCategoriesTable(): Promise<void> {
    await this.client.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        slug TEXT NOT NULL UNIQUE,
        description TEXT,
        createdBy TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE SET NULL
      )
    `)
    console.log("  ✓ Tabla categories creada")
  }

  private async createPostsTable(): Promise<void> {
    await this.client.execute(`
      CREATE TABLE IF NOT EXISTS posts (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        beforeTitle TEXT,
        lead TEXT,
        metaDesc TEXT,
        featuredImg TEXT,
        caption TEXT,
        body TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        readTime INTEGER NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        categoryId TEXT NOT NULL,
        authorId TEXT NOT NULL,
        isFeatured BOOLEAN NOT NULL DEFAULT FALSE,
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE RESTRICT,
        FOREIGN KEY (authorId) REFERENCES users(id) ON DELETE RESTRICT
      )
    `)
    console.log("  ✓ Tabla posts creada")
  }

  private async createIndexes(): Promise<void> {
    const indexes = [
      "CREATE INDEX IF NOT EXISTS idx_users_clerkId ON users(clerkId)",
      "CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)",
      "CREATE INDEX IF NOT EXISTS idx_posts_categoryId ON posts(categoryId)",
      "CREATE INDEX IF NOT EXISTS idx_posts_authorId ON posts(authorId)",
      "CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug)",
      "CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug)",
    ]

    for (const sql of indexes) {
      try {
        await this.client.execute(sql)
      } catch (error) {
        console.warn(`⚠️ Error creando índice:`, error)
      }
    }
    console.log("  ✓ Índices creados")
  }
}
