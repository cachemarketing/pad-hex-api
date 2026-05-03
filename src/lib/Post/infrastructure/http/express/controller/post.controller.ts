import { Request, Response, NextFunction } from "express"

export class PostController {
  async save(req: Request, res: Response, next: NextFunction) {}
  async findAll(req: Request, res: Response) {}
  async findByslug(req: Request, res: Response) {}
  async findById(req: Request, res: Response) {}
  async update(req: Request, res: Response) {}
}
