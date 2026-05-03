import dotenv from "dotenv"

dotenv.config({
  quiet: true,
})

export const connection = {
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
}
