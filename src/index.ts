import { Server } from "./infrastructure/server"

const PORT = Number(process.env.PORT) || 3500

const server = new Server(PORT)

process.on("unhandledRejection", (reason, promise) => {
  console.error("[Main]: Unhandled Rejection at:", promise, "reason:", reason)
  // No hacer exit aquí, solo loguear
})

process.on("uncaughtException", (error) => {
  console.error("[Main]: Uncaught Exception:", error)
  // No hacer exit aquí, solo loguear
})

async function main() {
  try {
    await server.start()
    console.log(`[Main]: Application started successfully on port ${PORT}`)

    // Mantener el proceso vivo
    // Opción 1: Mantener stdin abierto
    process.stdin.resume()

    // Opción 2: Mantener un intervalo vacío
    // setInterval(() => {}, 1000)

    // Opción 3: Esperar señales
    process.on("SIGINT", () => {
      console.log("SIGINT received, shutting down gracefully...")
      process.exit(0)
    })

    process.on("SIGTERM", () => {
      console.log("SIGTERM received, shutting down gracefully...")
      process.exit(0)
    })
  } catch (error) {
    console.error("[Main]: Failed to start server", error)
    process.exit(1)
  }
}

main()
process.on("beforeExit", (code) => {
  console.log("Process beforeExit event with code:", code)
  console.log("Event loop is empty, process will exit")
})

process.on("exit", (code) => {
  console.log("Process exit event with code:", code)
})

// Mostrar handles activos
setInterval(() => {
  const handles = (process as any)._getActiveHandles()
  const requests = (process as any)._getActiveRequests()
  console.log(
    `Active handles: ${handles.length}, Active requests: ${requests.length}`,
  )
}, 5000)
