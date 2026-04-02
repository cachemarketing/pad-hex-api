import { Server } from "./infrastructure/server"
const PORT = process.env.PORT ?? 3000
const server = new Server(PORT)
server.start()
