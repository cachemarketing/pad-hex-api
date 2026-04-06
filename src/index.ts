import { Server } from "./infrastructure/server"

const PORT = Number(process.env.PORT) || 3500
const server = new Server(PORT)

let isReady = false
let sigtermCount = 0

// Manejo de señales
process.on("SIGTERM", () => {
  sigtermCount++
  console.log(`SIGTERM received (${sigtermCount}), isReady: ${isReady}`)

  if (!isReady && sigtermCount < 3) {
    console.log("Ignoring SIGTERM during startup...")
    return
  }

  console.log("Shutting down gracefully...")
  process.exit(0)
})

process.on("unhandledRejection", (reason, promise) => {
  console.error("[Main]: Unhandled Rejection:", reason)
  // No hacer exit
})

process.on("uncaughtException", (error) => {
  console.error("[Main]: Uncaught Exception:", error)
  // No hacer exit
})

// Iniciar servidor
server
  .start()
  .then(() => {
    isReady = true
    console.log(`[Main]: Server started successfully on port ${PORT}`)
  })
  .catch((error) => {
    console.error("[Main]: Failed to start server", error)
    // No hacer exit inmediatamente, esperar un poco
    setTimeout(() => process.exit(1), 5000)
  })

console.log(`[Main]: Bootstrap initiated on port ${PORT}`)

// Mantener el proceso vivo
process.stdin.resume()

// Log de estado cada 10 segundos
setInterval(() => {
  console.log(
    `[Main]: Status - Ready: ${isReady}, Uptime: ${process.uptime().toFixed(0)}s`,
  )
}, 10000)
