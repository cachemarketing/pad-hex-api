import {
  IPostRepository,
  PostFilters,
} from "../../domain/repositories/IPostRepository"
import { Post } from "../../domain/entities/Post.entity"
import { TursoDatabase } from "../database/turso.database"
import { QueryBuilder } from "../database/queryBuilder"

export class TursoPostRepository implements IPostRepository {
  private db = TursoDatabase.getInstance().getClient()

  async save(post: Post): Promise<Post> {
    await this.db.execute({
      sql: `INSERT INTO posts (
        id, title, beforeTitle, lead, metaDesc, featuredImg, caption, 
        body, slug, readTime, createdAt, updatedAt, categoryId, 
        authorId, date, isFeatured
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        post.id,
        post.title,
        post.beforeTitle || null,
        post.lead || null,
        post.metaDesc || null,
        post.featuredImg || null,
        post.caption || null,
        post.body,
        post.slug,
        post.readTime,
        post.createdAt.toISOString(),
        post.updatedAt.toISOString(),
        post.categoryId,
        post.authorId, // ← ID del autor
        post.date.toISOString(),
        post.isFeatured,
      ],
    })

    return post
  }

  async findById(id: string): Promise<Post | null> {
    const result = await this.db.execute({
      sql: "SELECT * FROM posts WHERE id = ?",
      args: [id],
    })

    if (result.rows.length === 0) return null
    return this.mapToPost(result.rows[0])
  }

  async findAll(filters: PostFilters): Promise<Post[]> {
    const builder = new QueryBuilder("posts p")
    builder
      .select([
        "p.*",
        "u.name as authorName",
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
    return result.rows.map((row) => this.mapToPost(row))
  }

  async findBySlug(slug: string): Promise<Post | null> {
    const result = await this.db.execute({
      sql: `
      SELECT p.*,
      u.name as authorName,
      c.name as category_name,
      c.slug as category_slug
      FROM posts p
      LEFT JOIN categories c ON p.categoryId = c.id
      LEFT JOIN users u ON p.authorId = u.id
      WHERE p.slug = ?`,
      args: [slug],
    })

    if (result.rows.length === 0) return null
    return this.mapToPost(result.rows[0])
  }

  async findByCategory(categoryId: string): Promise<Post[]> {
    const result = await this.db.execute({
      sql: "SELECT * FROM posts WHERE categoryId = ? ORDER BY date DESC",
      args: [categoryId],
    })
    return result.rows.map((row) => this.mapToPost(row))
  }

  async delete(id: string): Promise<void> {
    await this.db.execute({
      sql: "DELETE FROM posts WHERE id = ?",
      args: [id],
    })
  }

  async update(id: string, postData: Partial<Post>): Promise<Post> {
    const existing = await this.findById(id)
    if (!existing) throw new Error("Post no encontrado")

    const updatedPost = existing.update(postData)

    await this.db.execute({
      sql: `UPDATE posts SET 
        title = ?, beforeTitle = ?, lead = ?, metaDesc = ?, 
        featuredImg = ?, caption = ?, body = ?, slug = ?, 
        readTime = ?, updatedAt = ?, categoryId = ?, 
        authorId = ?, date = ?, isFeatured = ?
        WHERE id = ?`,
      args: [
        updatedPost.title,
        updatedPost.beforeTitle || null,
        updatedPost.lead || null,
        updatedPost.metaDesc || null,
        updatedPost.featuredImg || null,
        updatedPost.caption || null,
        updatedPost.body,
        updatedPost.slug,
        updatedPost.readTime,
        updatedPost.updatedAt.toISOString(),
        updatedPost.categoryId,
        updatedPost.authorId,
        updatedPost.date.toISOString(),
        updatedPost.isFeatured,
        id,
      ],
    })

    return updatedPost
  }

  private mapToPost(row: any): Post {
    return new Post({
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
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
      categoryId: row.categoryId,
      authorId: row.authorId,
      authorName: row.authorName,
      category_name: row.category_name,
      date: new Date(row.date),
      isFeatured: row.isFeatured,
    })
  }
}
