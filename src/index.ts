import { Server } from "./infrastructure/server"

// Aseguramos que el puerto sea un número
const PORT = Number(process.env.PORT) || 3500

const server = new Server(PORT)
async function main() {
  try {
    await server.start()
    console.log(`[Main]: Application started successfully on port ${PORT}`)
  } catch (error) {
    console.error("[Main]: Failed to start server", error)
    // @ts-ignore
    if (error.code === "EADDRINUSE") {
      console.error(`❌ Puerto ${PORT} ya está en uso`)
      // @ts-ignore
    } else if (error.code === "EACCES") {
      console.error(
        `❌ No hay permisos para usar el puerto ${PORT} (necesitas puerto > 1024 o privilegios de root)`,
      )
    }
    process.exit(1)
  }
}

main()
