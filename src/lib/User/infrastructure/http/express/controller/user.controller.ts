import { Request, Response, NextFunction } from "express"
import { serviceContainer } from "../../../../../shared/infrastructure/services/serviceContainer"
import { UserNotFoundError } from "../../../../domain/error/userNotFoundError.error"

export class UserController {
  async save(req: Request, res: Response, next: NextFunction) {}
  async findByAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await serviceContainer.user.findAll.run()

      const users = result.map((user) => user.toPrimitives())

      return res.status(200).json({
        data: users,
      })
    } catch (err) {
      next(err)
    }
  }
  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await serviceContainer.user.findById.run(req.params.id)

      const user = result.toPrimitives()

      return res.status(200).json({
        data: user,
      })
    } catch (err) {
      if (err instanceof UserNotFoundError) {
        res.status(404).json({
          message: err.message,
        })

        next(err)
      }
    }
  }
  async findMe(req: Request, res: Response, next: NextFunction) {
    try {
      //@ts-ignore
      const { id } = req.user
      const result = await serviceContainer.user.findById.run(id.value)
      const user = result.toPrimitives()
      return res.status(200).json({
        data: user,
      })
    } catch (err) {
      if (err instanceof UserNotFoundError) {
        res.status(404).json({
          message: err.message,
        })

        next(err)
      }
    }
  }
  async findByClerkId(req: Request, res: Response, next: NextFunction) {}
  async findByEmail(req: Request, res: Response, next: NextFunction) {}
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      await serviceContainer.user.update.run(req.params.id, req.body)

      return res.status(201).send()
    } catch (err) {
      next(err)
    }
  }
}
