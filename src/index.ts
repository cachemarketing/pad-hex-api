import { Server } from "./infrastructure/server"

const PORT = Number(process.env.PORT) || 3500
const server = new Server(PORT)

// Flag para saber si el servidor está listo
let isServerReady = false

// Ignorar SIGTERM al inicio
process.on("SIGTERM", () => {
  if (!isServerReady) {
    console.log("⚠️ SIGTERM received but server not ready, ignoring...")
    return
  }
  console.log("🛑 SIGTERM received, shutting down gracefully...")
  process.exit(0)
})

process.on("unhandledRejection", (reason, promise) => {
  console.error("[Main]: Unhandled Rejection:", reason)
})

process.on("uncaughtException", (error) => {
  console.error("[Main]: Uncaught Exception:", error)
})

// Iniciar servidor
server
  .start()
  //@ts-ignore
  .then(() => {
    isServerReady = true
    console.log(`[Main]: Server is ready and will now accept SIGTERM`)
  })
  //@ts-ignore
  .catch((error) => {
    console.error("[Main]: Failed to start server", error)
    process.exit(1)
  })

console.log(`[Main]: Server initialization started on port ${PORT}`)

// Mantener el proceso vivo
process.stdin.resume()
