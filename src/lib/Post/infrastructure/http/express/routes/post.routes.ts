import { Router } from "express"
import { PostController } from "../controller/post.controller"

export const postRouter = Router()

const postController = new PostController()

postRouter.get("/", postController.findAll)
postRouter.get("/slug/:slug", postController.findByslug)
postRouter.get("/:id", postController.findById)

postRouter.post("/", postController.save)

postRouter.put("/:id", postController.update)
