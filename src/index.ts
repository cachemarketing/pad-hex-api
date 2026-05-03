import { Server } from "./api/server"

const PORT = Number(process.env.PORT) || 3500
const server = new Server(PORT)
server.start()
