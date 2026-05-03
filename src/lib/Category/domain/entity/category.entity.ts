import { CategoryCreatedAt } from "../value-objects/categoryCreatedAt.vo"
import { CategoryCreatedBy } from "../value-objects/categoryCreatedBy.vo"
import { CategoryDescription } from "../value-objects/categoryDescription.vo"
import { CategoryId } from "../value-objects/categoryId.vo"
import { CategoryName } from "../value-objects/categoryName.vo"
import { CategorySlug } from "../value-objects/categorySlug.vo"
import { CategoryUpdatedAt } from "../value-objects/categoryUpdatedAt.vo"

export interface ICategory {
  id: CategoryId
  name: CategoryName
  slug: CategorySlug
  description?: CategoryDescription
  createdBy: CategoryCreatedBy
  createdAt?: CategoryCreatedAt
  updatedAt?: CategoryUpdatedAt
}

export class Category {
  public readonly id: CategoryId
  public readonly name: CategoryName
  public readonly slug: CategorySlug
  public readonly description?: CategoryDescription
  public readonly createdBy: CategoryCreatedBy
  public readonly createdAt?: CategoryCreatedAt
  public updatedAt?: CategoryUpdatedAt

  constructor(category: ICategory) {
    this.id = category.id
    this.name = category.name
    this.slug = category.slug
    this.description = category.description
    this.createdBy = category.createdBy
    this.createdAt = category.createdAt
    this.updatedAt = category.updatedAt
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
      slug:
        data.slug ??
        (data.name
          ? new CategorySlug(this.generateSlug(data.name.value))
          : this.slug),
      description: data.description ?? this.description,
      createdBy: data.createdBy ?? this.createdBy,
      createdAt: this.createdAt,
      updatedAt: new CategoryUpdatedAt(new Date()),
    }

    return new Category(updatedData)
  }

  toPrimitives() {
    return {
      id: this.id.value,
      name: this.name.value,
      slug: this.slug.value,
      description: this.description?.value,
      createdBy: this.createdBy.value,
      createdAt: this.createdAt?.value,
      updatedAt: this.updatedAt?.value,
    }
  }
}
