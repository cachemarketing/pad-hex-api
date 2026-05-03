import { Router } from "express"
import { CategoryController } from "../controller/category.controller"

export const categoryRouter = Router()

const controller = new CategoryController()

categoryRouter.post("/", controller.save)
categoryRouter.get("/", controller.findAll)
categoryRouter.get("/:id", controller.findById)
categoryRouter.put("/:id", controller.update)
