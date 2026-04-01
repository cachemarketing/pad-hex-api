import dotenv from "dotenv"
dotenv.config()

export default {
  url: process.env.TURSO_DATABASE_URL || "http://localhost:8080",
  authToken: process.env.TURSO_AUTH_TOKEN || "",
}
