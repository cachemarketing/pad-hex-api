import { Router } from "express"
import { PostController } from "../controllers/PostController"
import { PostService } from "../../application/services/PostService"
import { authMiddleware } from "../auth/clerk.middleware"

export const createPostRoutes = (postService: PostService): Router => {
  const router = Router()
  const controller = new PostController(postService)
  const [clerkAuth, userSync] = authMiddleware()
  // Rutas - asegurar que coinciden con los nombres de los métodos
  router.post("/posts", clerkAuth, userSync, controller.createPost)
  router.get("/posts", controller.getAllPosts)
  router.get("/posts/:id", controller.getPost)
  router.get("/posts/slug/:slug", controller.getPostBySlug)
  router.get("/posts/category/:categoryId", controller.getPostsByCategory)
  router.put("/posts/:id", clerkAuth, userSync, controller.updatePost)
  router.delete("/posts/:id", clerkAuth, userSync, controller.deletePost)

  return router
}
