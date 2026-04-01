import { Post, IPost } from "../../domain/entities/Post.entity"
import { IPostRepository } from "../../domain/repositories/IPostRepository"
import { ICategoryRepository } from "../../domain/repositories/ICategoryRepository"
import { IUserRepository } from "../../domain/repositories/IUserRepository"

export class PostService {
  constructor(
    private postRepository: IPostRepository,
    private categoryRepository: ICategoryRepository,
    private userRepository: IUserRepository,
  ) {}

  async createPost(postData: IPost, clerkId: string): Promise<Post> {
    const user = await this.userRepository.findByClerkId(clerkId)
    if (!user) throw new Error("Usuario no encontrado")

    if (!user.canCreatePosts()) {
      throw new Error("No tienes permiso para crear posts")
    }

    const categoryExists = await this.categoryRepository.exists(
      postData.categoryId,
    )
    if (!categoryExists) {
      throw new Error("La categoría especificada no existe")
    }

    const slug = postData.slug || this.generateSlug(postData.title)
    const existingPost = await this.postRepository.findBySlug(slug)
    if (existingPost) {
      throw new Error("Ya existe un post con este slug")
    }

    const post = new Post({
      ...postData,
      slug,
      authorId: user.id,
      authorName: user.name,
    })

    return await this.postRepository.save(post)
  }

  async getAllPosts(): Promise<Post[]> {
    return await this.postRepository.findAll()
  }

  async getPost(id: string): Promise<Post | null> {
    return await this.postRepository.findById(id)
  }

  async getPostBySlug(slug: string): Promise<Post | null> {
    return await this.postRepository.findBySlug(slug)
  }

  async getPostsByCategory(categoryId: string): Promise<Post[]> {
    const categoryExists = await this.categoryRepository.exists(categoryId)
    if (!categoryExists) {
      throw new Error("La categoría especificada no existe")
    }
    return await this.postRepository.findByCategory(categoryId)
  }

  async updatePost(
    id: string,
    postData: Partial<IPost>,
    clerkId: string,
  ): Promise<Post> {
    const user = await this.userRepository.findByClerkId(clerkId)
    if (!user) throw new Error("Usuario no encontrado")

    const existingPost = await this.postRepository.findById(id)
    if (!existingPost) throw new Error("Post no encontrado")

    if (!user.canEditAnyPost() && existingPost.authorId !== user.id) {
      throw new Error("No tienes permiso para editar este post")
    }

    if (postData.categoryId) {
      const categoryExists = await this.categoryRepository.exists(
        postData.categoryId,
      )
      if (!categoryExists) {
        throw new Error("La categoría especificada no existe")
      }
    }

    if (postData.title) {
      const newSlug = this.generateSlug(postData.title)
      const slugExists = await this.postRepository.findBySlug(newSlug)
      if (slugExists && slugExists.id !== id) {
        throw new Error("Ya existe un post con ese título")
      }
      postData.slug = newSlug
    }

    return await this.postRepository.update(id, postData)
  }

  async deletePost(id: string, clerkId: string): Promise<void> {
    const user = await this.userRepository.findByClerkId(clerkId)
    if (!user) throw new Error("Usuario no encontrado")

    const post = await this.postRepository.findById(id)
    if (!post) throw new Error("Post no encontrado")

    if (!user.canDeleteAnyPost() && post.authorId !== user.id) {
      throw new Error("No tienes permiso para eliminar este post")
    }

    await this.postRepository.delete(id)
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
  }
}
