import { Request, Response, NextFunction } from "express"

export class UserController {
  async save(req: Request, res: Response, next: NextFunction) {}
  async findByAll(req: Request, res: Response, next: NextFunction) {}
  async findById(req: Request, res: Response, next: NextFunction) {}
  async findByClerkId(req: Request, res: Response, next: NextFunction) {}
  async findByEmail(req: Request, res: Response, next: NextFunction) {}
  async update(req: Request, res: Response, next: NextFunction) {}
}
