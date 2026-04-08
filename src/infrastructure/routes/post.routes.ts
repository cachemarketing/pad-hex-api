import { Router } from "express"
import { PostController } from "../controllers/PostController"
import { PostService } from "../../application/services/PostService"
import { requireAuthWithUser, requireRole } from "../auth/clerk.middleware"
import { adminAndWriterRole, onlyAdminRole } from "../auth/role.const"

export const createPostRoutes = (postService: PostService): Router => {
  const router = Router()
  const controller = new PostController(postService)
  router.post(
    "/posts",
    requireAuthWithUser(),
    requireRole(adminAndWriterRole),
    controller.createPost,
  )
  router.get("/posts", controller.getAllPosts)
  router.get("/posts/:id", controller.getPost)
  router.get("/posts/slug/:slug", controller.getPostBySlug)
  router.get("/posts/category/:categoryId", controller.getPostsByCategory)
  router.put(
    "/posts/:id",
    requireAuthWithUser(),
    requireRole(adminAndWriterRole),
    controller.updatePost,
  )
  router.delete(
    "/posts/:id",
    requireAuthWithUser(),
    requireRole(onlyAdminRole),
    controller.deletePost,
  )

  return router
}
