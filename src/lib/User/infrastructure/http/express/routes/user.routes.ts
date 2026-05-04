import { Router } from "express"
import { UserController } from "../controller/user.controller"

export { Router } from "express"

export const userRouter = Router()

const controller = new UserController()

userRouter.get("/", controller.findByAll)
userRouter.get("/me", controller.findById)
userRouter.get("/:id", controller.findById)
userRouter.put("/me", controller.update)
