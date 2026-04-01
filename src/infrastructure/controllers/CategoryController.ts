import { Request, Response } from "express"
import { CategoryService } from "../../application/services/CategoryService"

export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  createCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      //@ts-ignore
      const user = req.user
      if (!user) {
        res.status(401).json({ success: false, error: "No autenticado" })
        return
      }

      const category = await this.categoryService.createCategory(
        req.body,
        user.clerkId,
      )
      res.status(201).json({ success: true, data: category })
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message })
    }
  }

  getAllCategories = async (req: Request, res: Response): Promise<void> => {
    try {
      const categories = await this.categoryService.getAllCategories()
      res.status(200).json({ success: true, data: categories })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  getCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const category = await this.categoryService.getCategory(req.params.id)
      if (!category) {
        res
          .status(404)
          .json({ success: false, error: "Categoría no encontrada" })
        return
      }
      res.status(200).json({ success: true, data: category })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  updateCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      //@ts-ignore
      const user = req.user
      if (!user) {
        res.status(401).json({ success: false, error: "No autenticado" })
        return
      }

      const category = await this.categoryService.updateCategory(
        req.params.id,
        req.body,
        user.clerkId,
      )
      res.status(200).json({ success: true, data: category })
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message })
    }
  }

  deleteCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      //@ts-ignore
      const user = req.user
      if (!user) {
        res.status(401).json({ success: false, error: "No autenticado" })
        return
      }

      await this.categoryService.deleteCategory(req.params.id, user.clerkId)
      res.status(200).json({ success: true, message: "Categoría eliminada" })
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message })
    }
  }
}
