import { Router } from "express"
import { PostController } from "../controller/post.controller"
import {
  checkAuth,
  requireRole,
} from "../../../../../shared/infrastructure/http/express/middleware/clerk.middleware"
import { adminAndWriterRole } from "../../../../../shared/infrastructure/config/role.const"

export const postRouter = Router()

const postController = new PostController()

postRouter.get("/", postController.findAll)
postRouter.get("/slug/:slug", postController.findByslug)
postRouter.get("/:id", postController.findById)

postRouter.post(
  "/",
  checkAuth,
  requireRole(adminAndWriterRole),
  postController.save,
)

postRouter.put(
  "/:id",
  checkAuth,
  requireRole(adminAndWriterRole),
  postController.update,
)
