import { Server } from "./infrastructure/server"

const PORT = Number(process.env.PORT) || 3500
const server = new Server(PORT)

// Iniciar servidor
server.start()

console.log(`[Main]: Server initialization started on port ${PORT}`)

// Manejo de señales
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully...")
  process.exit(0)
})

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully...")
  process.exit(0)
})
