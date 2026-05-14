import { TursoDatabase } from "../../../shared/infrastructure/database/turso.db"
import { QueryBuilder } from "../../../shared/infrastructure/utils/queryBuilder"
import { PostDetailDTO } from "../../application/dto/PostDetail.dto"
import {
  PostFilters,
  PostQueryRepository,
} from "../../application/query/postQuery.repository"
import { Post } from "../../domain/entity/post.entity"
import { PostRepository } from "../../domain/repository/post.repository"
import { PostAuthorId } from "../../domain/value-objects/postAuthorId.vo"
import { PostBeforeTitle } from "../../domain/value-objects/postBeforeTitle.vo"
import { PostBody } from "../../domain/value-objects/postBody.vo"
import { PostCaption } from "../../domain/value-objects/postCaption.vo"
import { PostCategoryId } from "../../domain/value-objects/postCategoryId.vo"
import { PostDate } from "../../domain/value-objects/postDate.vo"
import { PostFeaturedImg } from "../../domain/value-objects/postFeaturedImg.vo"
import { PostId } from "../../domain/value-objects/postId.vo"
import { PostIsFeatured } from "../../domain/value-objects/postIsFeatured.vo"
import { PostLead } from "../../domain/value-objects/postLead.vo"
import { PostMetaDesc } from "../../domain/value-objects/postMetaDesc.vo"
import { PostReadTime } from "../../domain/value-objects/postReadTime.vo"
import { PostSlug } from "../../domain/value-objects/postSlug.vo"
import { PostTitle } from "../../domain/value-objects/postTitle.vo"

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
  category: {
    name: string
    slug: string
  }
  author: {
    name: string
    email: string
    role: string
    clerkId: string
  }
}

export class PostTursoRepository implements PostRepository {
  private db = TursoDatabase.getInstance().getClient()
  private tableName = "posts"
  async save(post: Post): Promise<void> {
    console.log(post)
    const query = {
      sql: `INSERT INTO ${this.tableName} (
        id, title, beforeTitle, lead, metaDesc, featuredImg, caption, 
        body, slug, readTime, categoryId, 
        authorId, date, isFeatured
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        post.id.value,
        post.title.value,
        post.beforeTitle?.value || null,
        post.lead.value,
        post.metaDesc.value,
        post.featuredImg.value,
        post.caption.value,
        post.body.value,
        post.slug.value,
        post.readTime.value,
        post.categoryId.value,
        post.authorId.value,
        post.date.value,
        post.isFeatured.value,
      ],
    }

    await this.db.execute(query)
  }

  async findById(id: PostId): Promise<Post | null> {
    const result = await this.db.execute({
      sql: "SELECT * FROM posts WHERE id = ?",
      args: [id.value],
    })

    if (result.rows.length === 0) return null
    return this.mapToPost(result.rows[0] as unknown as PostTurso)
  }

  async update(id: PostId, post: Partial<Post>): Promise<void> {
    const existing = await this.findById(id)
    if (!existing) throw new Error("Post no encontrado")

    const updatedPost = existing.update(post)

    await this.db.execute({
      sql: `UPDATE posts SET 
        title = ?, beforeTitle = ?, lead = ?, metaDesc = ?, 
        featuredImg = ?, caption = ?, body = ?, slug = ?, 
        readTime = ?, updatedAt = ?, categoryId = ?, 
        authorId = ?, date = ?, isFeatured = ?
        WHERE id = ?`,
      args: [
        updatedPost.title.value,
        updatedPost.beforeTitle?.value ?? null,
        updatedPost.lead.value || null,
        updatedPost.metaDesc.value || null,
        updatedPost.featuredImg.value || null,
        updatedPost.caption.value || null,
        updatedPost.body.value,
        updatedPost.slug.value,
        updatedPost.readTime.value,
        updatedPost.updatedAt?.value ?? null,
        updatedPost.categoryId.value,
        updatedPost.authorId.value,
        updatedPost.date.value,
        updatedPost.isFeatured.value,
        id.value,
      ],
    })
  }

  private mapToPost(row: PostTurso): Post {
    return new Post({
      id: new PostId(row.id),
      title: new PostTitle(row.title),
      beforeTitle: new PostBeforeTitle(row.beforeTitle ?? null),
      lead: new PostLead(row.lead),
      metaDesc: new PostMetaDesc(row.metaDesc),
      featuredImg: new PostFeaturedImg(row.featuredImg),
      caption: new PostCaption(row.caption),
      body: new PostBody(row.body),
      slug: new PostSlug(row.slug),
      readTime: new PostReadTime(row.readTime),
      categoryId: new PostCategoryId(row.categoryId),
      authorId: new PostAuthorId(row.authorId),
      date: new PostDate(row.date),
      isFeatured: new PostIsFeatured(row.isFeatured),
    })
  }
}
