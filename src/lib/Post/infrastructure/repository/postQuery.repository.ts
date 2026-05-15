import { TursoDatabase } from "../../../shared/infrastructure/database/turso.db"
import { QueryBuilder } from "../../../shared/infrastructure/utils/queryBuilder"
import { PostDetailDTO } from "../../application/dto/PostDetail.dto"
import {
  PostFilters,
  PostQueryRepository,
} from "../../application/query/postQuery.repository"

export interface PostTurso {
  id: string
  title: string
  beforeTitle?: string
  lead: string
  metaDesc: string
  featuredImg: string
  caption: string
  body: string
  slug: string
  readTime: number
  createdAt: Date
  updatedAt: Date
  categoryId: string
  authorId: string
  date: Date
  isFeatured: boolean
  category_name: string
  category_slug: string
  author_name: string
  author_role: string
  author_email: string
  og_img: string
}

export class PostTursoQueryRepository implements PostQueryRepository {
  private db = TursoDatabase.getInstance().getClient()
  private tableName = "posts"

  async findAll(filters: PostFilters): Promise<PostDetailDTO[]> {
    const builder = new QueryBuilder(`${this.tableName} p`)
    builder
      .select([
        "p.*",
        "u.name as author_name",
        "u.role as author_role",
        "u.email as author_email",
        "c.name as category_name",
        "c.slug as category_slug",
      ])
      .join("categories c", "p.categoryId = c.id", "LEFT")
      .join("users u", "p.authorId = u.id", "LEFT")
      .orderBy("p.date", "DESC")

    if (typeof filters.isFeatured === "boolean") {
      builder.where("p.isFeatured", filters.isFeatured)
    }
    if (filters.title) {
      builder.where("p.title", `%${filters.title}%`, "LIKE")
    }

    if (filters.authorId) {
      builder.where("p.authorId", filters.authorId)
    }
    const result = await this.db.execute({
      sql: builder.build().sql,
      args: builder.build().args,
    })
    return result.rows.map((row) =>
      this.mapToDetails(row as unknown as PostTurso),
    )
  }

  async findById(id: string): Promise<PostDetailDTO | null> {
    const result = await this.db.execute({
      sql: `SELECT * FROM ${this.tableName} WHERE id = ?`,
      args: [id],
    })

    if (result.rows.length === 0) return null
    return this.mapToDetails(result.rows[0] as unknown as PostTurso)
  }

  async findBySlug(slug: string): Promise<PostDetailDTO | null> {
    const result = await this.db.execute({
      sql: `
      SELECT p.*,
      u.name as author_name,
      u.role as author_role,
      u.email as author_email,
      c.name as category_name,
      c.slug as category_slug
      FROM ${this.tableName} p
      LEFT JOIN categories c ON p.categoryId = c.id
      LEFT JOIN users u ON p.authorId = u.id
      WHERE p.slug = ?`,
      args: [slug],
    })

    if (result.rows.length === 0) return null
    return this.mapToDetails(result.rows[0] as unknown as PostTurso)
  }

  private mapToDetails(row: PostTurso): PostDetailDTO {
    return {
      id: row.id,
      title: row.title,
      beforeTitle: row.beforeTitle,
      lead: row.lead,
      metaDesc: row.metaDesc,
      featuredImg: row.featuredImg,
      caption: row.caption,
      body: row.body,
      slug: row.slug,
      readTime: row.readTime,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      categoryId: row.categoryId,
      authorId: row.authorId,
      date: row.date,
      isFeatured: row.isFeatured,
      ogImg: row.og_img,
      category: {
        name: row.category_name,
        slug: row.category_slug,
      },
      author: {
        name: row.author_name,
        email: row.author_email,
        role: row.author_role,
      },
    }
  }
}
