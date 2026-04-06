import { Server } from "./infrastructure/server"

const PORT = Number(process.env.PORT) || 3500
const server = new Server(PORT)

let isReady = false

process.on("SIGTERM", () => {
  console.log(
    "SIGTERM received, but ignoring because we use direct node execution",
  )
  // No hacer exit, dejar que el servidor siga corriendo
})

process.on("unhandledRejection", (reason) => {
  console.error("[Main]: Unhandled Rejection:", reason)
})

process.on("uncaughtException", (error) => {
  console.error("[Main]: Uncaught Exception:", error)
})

// Iniciar servidor y mantener el proceso vivo para siempre
async function main() {
  try {
    await server.start()
    isReady = true
    console.log(`[Main]: Server started successfully on port ${PORT}`)

    // Nunca resolver esta promesa completamente
    await new Promise(() => {})
  } catch (error) {
    console.error("[Main]: Failed to start server", error)
    process.exit(1)
  }
}

main()
