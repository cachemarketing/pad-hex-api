import { Request, Response } from "express"
import { PostService } from "../../application/services/PostService"

export class PostController {
  constructor(private postService: PostService) {}

  createPost = async (req: Request, res: Response): Promise<void> => {
    try {
      //@ts-ignore
      const user = req.user
      if (!user) {
        res.status(401).json({ success: false, error: "No autenticado" })
        return
      }

      // featuredImg puede ser una URL de S3 o una URL externa
      const postData = {
        ...req.body,
        featuredImg: req.body.featuredImg, // Ya es la URL de S3
      }

      const post = await this.postService.createPost(postData, user.clerkId)
      res.status(201).json({ success: true, data: post })
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message })
    }
  }

  getAllPosts = async (req: Request, res: Response): Promise<void> => {
    try {
      const posts = await this.postService.getAllPosts()
      res.status(200).json({ success: true, data: posts, count: posts.length })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  getPost = async (req: Request, res: Response): Promise<void> => {
    try {
      const post = await this.postService.getPost(req.params.id)
      if (!post) {
        res.status(404).json({ success: false, error: "Post no encontrado" })
        return
      }
      res.status(200).json({ success: true, data: post })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  getPostBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
      const post = await this.postService.getPostBySlug(req.params.slug)
      if (!post) {
        res.status(404).json({ success: false, error: "Post no encontrado" })
        return
      }
      res.status(200).json({ success: true, data: post })
    } catch (error: any) {
      console.log(error)
      res.status(500).json({ success: false, error: error.message })
    }
  }

  // ✅ Obtener posts por categoría
  getPostsByCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const posts = await this.postService.getPostsByCategory(
        req.params.categoryId,
      )
      res.status(200).json({ success: true, data: posts, count: posts.length })
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message })
    }
  }

  // ✅ Actualizar post
  updatePost = async (req: Request, res: Response): Promise<void> => {
    try {
      //@ts-ignore
      const user = req.user
      if (!user) {
        res.status(401).json({ success: false, error: "No autenticado" })
        return
      }

      const post = await this.postService.updatePost(
        req.params.id,
        req.body,
        user.clerkId,
      )
      res.status(200).json({ success: true, data: post })
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message })
    }
  }

  // ✅ Eliminar post
  deletePost = async (req: Request, res: Response): Promise<void> => {
    try {
      //@ts-ignore
      const user = req.user
      if (!user) {
        res.status(401).json({ success: false, error: "No autenticado" })
        return
      }

      await this.postService.deletePost(req.params.id, user.clerkId)
      res.status(200).json({ success: true, message: "Post eliminado" })
    } catch (error: any) {
      res.status(403).json({ success: false, error: error.message })
    }
  }
}
