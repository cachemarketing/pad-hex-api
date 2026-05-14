import { Request, Response, NextFunction } from "express"
import { serviceContainer } from "../../../../../shared/infrastructure/services/serviceContainer"

export class CategoryController {
  async save(req: Request, res: Response, next: NextFunction) {}
  async findAll(req: Request, res: Response, next: NextFunction) {
    const data = await serviceContainer.caetgory.findAll.run()

    const categories = data.map((category) => category.toPrimitives())

    return res.status(200).json({
      data: categories,
    })
  }
  async findById(req: Request, res: Response, next: NextFunction) {}
  async update(req: Request, res: Response, next: NextFunction) {}
}
