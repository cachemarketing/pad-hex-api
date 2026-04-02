import { Server } from "./infrastructure/server"

// Aseguramos que el puerto sea un número
const PORT = Number(process.env.PORT) || 3500

const server = new Server(PORT)

// Ejecución con manejo básico de errores
try {
  server.start()
  console.log(`[Main]: Application started on port ${PORT}`)
} catch (error) {
  console.error("[Main]: Failed to start server", error)
  process.exit(1)
}
