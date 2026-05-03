import { Router } from "express"
import { postRouter } from "../../../../../Post/infrastructure/http/express/routes/post.routes"
import { categoryRouter } from "../../../../../Category/infrastructure/http/express/routes/category.routes"

export const apiRouter = Router()

apiRouter.use("/posts", postRouter)
apiRouter.use("/categories", categoryRouter)
