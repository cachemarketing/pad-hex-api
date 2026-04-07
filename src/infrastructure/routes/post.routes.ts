import { Router } from "express"
import { PostController } from "../controllers/PostController"
import { PostService } from "../../application/services/PostService"
import { requireAuthWithUser } from "../auth/clerk.middleware"

export const createPostRoutes = (postService: PostService): Router => {
  const router = Router()
  const controller = new PostController(postService)
  // Rutas - asegurar que coinciden con los nombres de los métodos
  router.post("/posts", requireAuthWithUser(), controller.createPost)
  router.get("/posts", controller.getAllPosts)
  router.get("/posts/:id", controller.getPost)
  router.get("/posts/slug/:slug", controller.getPostBySlug)
  router.get("/posts/category/:categoryId", controller.getPostsByCategory)
  router.put("/posts/:id", requireAuthWithUser(), controller.updatePost)
  router.delete("/posts/:id", requireAuthWithUser(), controller.deletePost)

  return router
}
