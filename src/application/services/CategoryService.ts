// application/services/CategoryService.ts
import { Category, ICategory } from "../../domain/entities/Category.entity"
import { ICategoryRepository } from "../../domain/repositories/ICategoryRepository"
import { IUserRepository } from "../../domain/repositories/IUserRepository"

export class CategoryService {
  constructor(
    private categoryRepository: ICategoryRepository,
    private userRepository: IUserRepository,
  ) {}

  async createCategory(
    categoryData: ICategory,
    clerkId: string,
  ): Promise<Category> {
    // 1. Obtener usuario
    const user = await this.userRepository.findByClerkId(clerkId)
    if (!user) throw new Error("Usuario no encontrado")

    // 2. Verificar permisos
    if (!user.canCreateCategories()) {
      throw new Error("No tienes permiso para crear categorías")
    }

    // 3. Verificar slug único
    const slug = categoryData.slug || this.generateSlug(categoryData.name)
    const existing = await this.categoryRepository.findBySlug(slug)
    if (existing) {
      throw new Error("Ya existe una categoría con este slug")
    }

    // 4. Crear categoría con el creador
    const category = new Category({ ...categoryData, slug })
    return await this.categoryRepository.save(category)
  }

  async getAllCategories(): Promise<Category[]> {
    return await this.categoryRepository.findAll()
  }

  async getCategory(id: string): Promise<Category | null> {
    return await this.categoryRepository.findById(id)
  }

  async updateCategory(
    id: string,
    categoryData: Partial<ICategory>,
    clerkId: string,
  ): Promise<Category> {
    const user = await this.userRepository.findByClerkId(clerkId)
    if (!user) throw new Error("Usuario no encontrado")

    if (!user.canCreateCategories()) {
      throw new Error("No tienes permiso para editar categorías")
    }

    return await this.categoryRepository.update(id, categoryData)
  }

  async deleteCategory(id: string, clerkId: string): Promise<void> {
    const user = await this.userRepository.findByClerkId(clerkId)
    if (!user) throw new Error("Usuario no encontrado")

    if (!user.canCreateCategories()) {
      throw new Error("No tienes permiso para eliminar categorías")
    }

    await this.categoryRepository.delete(id)
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
  }
}
