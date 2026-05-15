import { Request, Response, NextFunction } from "express"
import { serviceContainer } from "../../../../../shared/infrastructure/services/serviceContainer"
import { PostNotFoundError } from "../../../../domain/errors/postNotFoundError.error"

export class PostController {
  async save(req: Request, res: Response, next: NextFunction) {
    try {
      const post = {
        ...req.body,
        date: Date.now(),
      }
      console.log(post)
      await serviceContainer.post.save.run(post)

      return res.status(201).send()
    } catch (err) {
      next(err)
    }
  }
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { isFeatured, title, authorId } = req.query
      const verifyFeatured = isFeatured?.toString()
        ? JSON.parse(isFeatured.toString())
        : undefined
      const posts = await serviceContainer.post.findAll.run({
        isFeatured: verifyFeatured,
        title: title?.toString(),
        authorId: authorId?.toString(),
      })

      return res.status(200).json({
        data: posts,
      })
    } catch (err) {
      next(err)
    }
  }
  async findByslug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params

      const post = await serviceContainer.post.findBySlug.run(slug)
      return res.status(200).json({
        data: post,
      })
    } catch (err) {
      if (err instanceof PostNotFoundError) {
        return res.status(404).json({
          message: err.message,
        })
      }
      next(err)
    }
  }
  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params

      const post = await serviceContainer.post.findById.run(id)

      return res.status(200).json({
        data: post,
      })
    } catch (err) {
      if (err instanceof PostNotFoundError) {
        return res.status(404).json({
          message: err.message,
        })
      }
    }
  }
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      await serviceContainer.post.update.run(req.params.id, req.body)

      return res.status(201).send()
    } catch (err) {
      next(err)
    }
  }
}
