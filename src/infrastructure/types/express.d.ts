import { User } from "../../lib/User/domain/entity/user.entity"

// No importes Express aquí, usa la declaración global
declare global {
  namespace Express {
    interface Request {
      userId?: string
      user?: User
      auth?: {
        userId: string
        sessionId: string
        // otras propiedades que Clerk pueda agregar
      }
    }
  }
}

// Exporta un objeto vacío para que TypeScript trate esto como un módulo
export {}
