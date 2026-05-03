import { createClient, Client } from "@libsql/client"
import { connection } from "../config/turso.config"

export class TursoDatabase {
  private static instance: TursoDatabase
  private client: Client
  private initialized = false

  private constructor() {
    this.client = createClient(connection)
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
      this.initialized = true
      console.log("✅ Base de datos Turso inicializada")
    } catch (error) {
      console.error("❌ Error inicializando DB:", error)
      throw error
    }
  }
}
