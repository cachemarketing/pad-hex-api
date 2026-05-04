import { Router } from "express"
import { postRouter } from "../../../../../Post/infrastructure/http/express/routes/post.routes"
import { categoryRouter } from "../../../../../Category/infrastructure/http/express/routes/category.routes"
import { userRouter } from "../../../../../User/infrastructure/http/express/routes/user.routes"
import { onlyAdminRole } from "../../../config/role.const"
import { requireRole } from "../middleware/clerk.middleware"

export const apiRouter = Router()

apiRouter.use("/posts", postRouter)
apiRouter.use("/categories", categoryRouter)
apiRouter.use("/users", requireRole(onlyAdminRole), userRouter)
