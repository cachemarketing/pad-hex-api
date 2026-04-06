import { Server } from "./infrastructure/server"

const PORT = Number(process.env.PORT) || 3500

const server = new Server(PORT)

process.on("unhandledRejection", (reason, promise) => {
  console.error("[Main]: Unhandled Rejection at:", promise, "reason:", reason)
  process.exit(1)
})

process.on("uncaughtException", (error) => {
  console.error("[Main]: Uncaught Exception:", error)
  console.error("[Main]: Stack trace:", error.stack)
  process.exit(1)
})

async function main() {
  try {
    await server.start()
    console.log(`[Main]: Application started successfully on port ${PORT}`)

    // Mantener el proceso vivo
    process.stdin.resume()
  } catch (error) {
    console.error("[Main]: Failed to start server", error)
    console.error(
      "[Main]: Error details:",
      JSON.stringify(error, Object.getOwnPropertyNames(error), 2),
    )
    process.exit(1)
  }
}

main()
