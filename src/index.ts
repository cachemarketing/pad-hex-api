import { Server } from "./infrastructure/server"

// Aseguramos que el puerto sea un número
const PORT = Number(process.env.PORT) || 3500

const server = new Server(PORT)

// Manejadores globales para errores no capturados
process.on("unhandledRejection", (reason, promise) => {
  console.error("[Main]: Unhandled Rejection at:", promise, "reason:", reason)
  process.exit(1)
})

process.on("uncaughtException", (error) => {
  console.error("[Main]: Uncaught Exception:", error)
  process.exit(1)
})

// ✅ Ejecución correcta con manejo de promesas
async function main() {
  try {
    await server.start() // ✅ Esperamos a que termine la inicialización
    console.log(`[Main]: Application started successfully on port ${PORT}`)
  } catch (error) {
    console.error("[Main]: Failed to start server", error)
    process.exit(1)
  }
}

main()
