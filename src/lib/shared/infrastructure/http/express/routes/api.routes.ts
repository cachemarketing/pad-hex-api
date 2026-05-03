import { Router } from "express"
import { postRouter } from "../../../../../Post/infrastructure/http/express/routes/post.routes"

export const apiRouter = Router()

apiRouter.use("/posts", postRouter)
