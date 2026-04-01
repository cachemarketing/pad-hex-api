import { v4 as uuidv4 } from "uuid"

export interface ICategory {
  id?: string
  name: string
  slug: string
  description?: string
  createdAt?: Date
  updatedAt?: Date
}

export class Category {
  public readonly id: string
  public readonly name: string
  public readonly slug: string
  public readonly description?: string
  public readonly createdAt: Date
  public updatedAt: Date

  constructor(category: ICategory) {
    this.validate(category)

    this.id = category.id || uuidv4()
    this.name = category.name
    this.slug = category.slug || this.generateSlug(category.name)
    this.description = category.description
    this.createdAt = category.createdAt || new Date()
    this.updatedAt = category.updatedAt || new Date()
  }

  private validate(category: ICategory): void {
    if (!category.name || category.name.length < 2) {
      throw new Error(
        "El nombre de la categoría debe tener al menos 2 caracteres",
      )
    }
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
  }

  update(data: Partial<ICategory>): Category {
    const updatedData = {
      id: this.id,
      name: data.name ?? this.name,
      slug: data.slug ?? (data.name ? this.generateSlug(data.name) : this.slug),
      description: data.description ?? this.description,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    }

    return new Category(updatedData)
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      slug: this.slug,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }
}
