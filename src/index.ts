import { Server } from "./infrastructure/server"

const server = new Server(3000)
server.start()
