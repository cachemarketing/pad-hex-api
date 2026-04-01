import dotenv from "dotenv"
dotenv.config()

export const config = {
  port: process.env.PORT || 3000,
  turso: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
  clerk: {
    secretKey: process.env.CLERK_SECRET_KEY!,
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY!,
  },
}
