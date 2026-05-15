import { Router } from "express"
import { postRouter } from "../../../../../Post/infrastructure/http/express/routes/post.routes"
import { categoryRouter } from "../../../../../Category/infrastructure/http/express/routes/category.routes"
import { userRouter } from "../../../../../User/infrastructure/http/express/routes/user.routes"
import { authMiddleware } from "../middleware/clerk.middleware"
export const apiRouter = Router()

const [getAuthUser] = authMiddleware()

apiRouter.use("/posts", getAuthUser, postRouter)
apiRouter.use("/categories", getAuthUser, categoryRouter)
apiRouter.use("/users", getAuthUser, userRouter)
