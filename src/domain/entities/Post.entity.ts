import { v4 as uuidv4 } from "uuid"

export interface IPost {
  id?: string
  title: string
  beforeTitle?: string
  lead?: string
  metaDesc?: string
  featuredImg?: string
  caption?: string
  body: string
  slug: string
  readTime: number
  createdAt?: Date
  updatedAt?: Date
  categoryId: string
  authorId: string
  authorName: string
  category_name: string
  date?: Date
  isFeatured: boolean
}

export class Post {
  public readonly id: string
  public readonly title: string
  public readonly beforeTitle?: string
  public readonly lead?: string
  public readonly metaDesc?: string
  public readonly featuredImg?: string
  public readonly caption?: string
  public readonly body: string
  public readonly slug: string
  public readonly readTime: number
  public readonly createdAt: Date
  public updatedAt: Date
  public readonly categoryId: string
  public readonly authorId: string
  public readonly authorName: string
  public readonly category_name: string
  public readonly date: Date
  public readonly isFeatured: boolean

  constructor(post: IPost) {
    this.validate(post)

    this.id = post.id || uuidv4()
    this.title = post.title
    this.beforeTitle = post.beforeTitle
    this.lead = post.lead
    this.metaDesc = post.metaDesc || post.title.substring(0, 160)
    this.featuredImg = post.featuredImg
    this.caption = post.caption
    this.body = post.body
    this.slug = post.slug || this.generateSlug(post.title)
    this.readTime = post.readTime || this.calculateReadTime(post.body)
    this.createdAt = post.createdAt || new Date()
    this.updatedAt = post.updatedAt || new Date()
    this.categoryId = post.categoryId
    this.authorId = post.authorId
    this.authorName = post.authorName
    this.category_name = post.category_name
    this.date = post.date || new Date()
    this.isFeatured = post.isFeatured || post.isFeatured
  }

  private validate(post: IPost): void {
    if (!post.title || post.title.length < 3) {
      throw new Error("El título debe tener al menos 3 caracteres")
    }
    if (!post.body || post.body.length < 10) {
      throw new Error("El contenido debe tener al menos 10 caracteres")
    }
    if (!post.categoryId) {
      throw new Error("La categoría es requerida")
    }
    if (!post.authorId) {
      // ← VALIDAR authorId
      throw new Error("El autor es requerido")
    }
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
  }

  private calculateReadTime(content: string): number {
    const wordsPerMinute = 200
    const words = content.trim().split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
  }

  update(data: Partial<IPost>): Post {
    const updatedData = {
      id: this.id,
      title: data.title ?? this.title,
      beforeTitle: data.beforeTitle ?? this.beforeTitle,
      lead: data.lead ?? this.lead,
      metaDesc: data.metaDesc ?? this.metaDesc,
      featuredImg: data.featuredImg ?? this.featuredImg,
      caption: data.caption ?? this.caption,
      body: data.body ?? this.body,
      slug:
        data.slug ?? (data.title ? this.generateSlug(data.title) : this.slug),
      readTime:
        data.readTime ??
        (data.body ? this.calculateReadTime(data.body) : this.readTime),
      createdAt: this.createdAt,
      updatedAt: new Date(),
      categoryId: data.categoryId ?? this.categoryId,
      authorId: data.authorId ?? this.authorId, // ← mantener authorId
      authorName: data.authorName ?? this.authorName, // ← mantener authorName
      category_name: data.category_name ?? this.category_name, // ← mantener authorName
      date: data.date ?? this.date,
      isFeatured: data.isFeatured ?? this.isFeatured,
    }

    return new Post(updatedData)
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      beforeTitle: this.beforeTitle,
      lead: this.lead,
      metaDesc: this.metaDesc,
      featuredImg: this.featuredImg,
      caption: this.caption,
      body: this.body,
      slug: this.slug,
      readTime: this.readTime,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      categoryId: this.categoryId,
      authorId: this.authorId,
      authorName: this.authorName,
      category_name: this.category_name,
      date: this.date,
      isFeatured: this.isFeatured,
    }
  }
}
