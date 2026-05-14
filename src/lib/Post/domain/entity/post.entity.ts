import { PostAuthorId } from "../value-objects/postAuthorId.vo"
import { PostBeforeTitle } from "../value-objects/postBeforeTitle.vo"
import { PostBody } from "../value-objects/postBody.vo"
import { PostCaption } from "../value-objects/postCaption.vo"
import { PostCategoryId } from "../value-objects/postCategoryId.vo"
import { PostCreatedAt } from "../value-objects/postCreatedAt.vo"
import { PostDate } from "../value-objects/postDate.vo"
import { PostFeaturedImg } from "../value-objects/postFeaturedImg.vo"
import { PostId } from "../value-objects/postId.vo"
import { PostIsFeatured } from "../value-objects/postIsFeatured.vo"
import { PostLead } from "../value-objects/postLead.vo"
import { PostMetaDesc } from "../value-objects/postMetaDesc.vo"
import { PostReadTime } from "../value-objects/postReadTime.vo"
import { PostSlug } from "../value-objects/postSlug.vo"
import { PostTitle } from "../value-objects/postTitle.vo"
import { PostUpdatedAt } from "../value-objects/postUpdateAt.vo"

export interface IPost {
  id: PostId
  title: PostTitle
  beforeTitle?: PostBeforeTitle
  lead: PostLead
  metaDesc: PostMetaDesc
  featuredImg: PostFeaturedImg
  caption: PostCaption
  body: PostBody
  slug: PostSlug
  readTime: PostReadTime
  createdAt?: PostCreatedAt
  updatedAt?: PostUpdatedAt
  categoryId: PostCategoryId
  authorId: PostAuthorId
  date: PostDate
  isFeatured: PostIsFeatured
}

export class Post {
  public readonly id: PostId
  public readonly title: PostTitle
  public readonly beforeTitle?: PostBeforeTitle
  public readonly lead: PostLead
  public readonly metaDesc: PostMetaDesc
  public readonly featuredImg: PostFeaturedImg
  public readonly caption: PostCaption
  public readonly body: PostBody
  public readonly slug: PostSlug
  public readonly readTime: PostReadTime
  public readonly createdAt?: PostCreatedAt
  public updatedAt?: PostUpdatedAt
  public readonly categoryId: PostCategoryId
  public readonly authorId: PostAuthorId
  public readonly date: PostDate
  public readonly isFeatured: PostIsFeatured

  constructor(post: IPost) {
    this.id = post.id
    this.title = post.title
    this.beforeTitle = post.beforeTitle
    this.lead = post.lead
    this.metaDesc = post.metaDesc
    this.featuredImg = post.featuredImg
    this.caption = post.caption
    this.body = post.body
    this.slug = post.slug
    this.readTime = new PostReadTime(this.calculateReadTime(post.body.value))
    this.categoryId = post.categoryId
    this.authorId = post.authorId
    this.date = post.date
    this.isFeatured = post.isFeatured
    this.createdAt = post.createdAt
    this.updatedAt = post.updatedAt
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
      title: new PostTitle(data.title?.value ?? this.title.value),
      beforeTitle: new PostBeforeTitle(
        data.beforeTitle?.value ?? this.beforeTitle?.value ?? null,
      ),
      lead: new PostLead(data.lead?.value ?? this.lead.value),
      metaDesc: new PostMetaDesc(data.metaDesc?.value ?? this.metaDesc.value),
      featuredImg: new PostFeaturedImg(
        data.featuredImg?.value ?? this.featuredImg.value,
      ),
      caption: new PostCaption(data.caption?.value ?? this.caption.value),
      body: new PostBody(data.body?.value ?? this.body.value),
      slug: new PostSlug(
        data.slug?.value ??
          (data.title?.value
            ? this.generateSlug(data.title?.value)
            : this.slug.value),
      ),
      readTime: new PostReadTime(
        data.readTime?.value ??
          (data.body?.value
            ? this.calculateReadTime(data.body.value)
            : this.readTime.value),
      ),
      createdAt: this.createdAt,
      updatedAt: new PostUpdatedAt(new Date()),
      categoryId: new PostCategoryId(
        data.categoryId?.value ?? this.categoryId.value,
      ),
      authorId: new PostAuthorId(data.authorId?.value ?? this.authorId.value),
      date: new PostDate(data.date?.value ?? this.date.value),
      isFeatured: new PostIsFeatured(
        data.isFeatured?.value ?? this.isFeatured.value,
      ),
    }

    return new Post(updatedData)
  }

  tpPrimitives() {
    return {
      id: this.id.value,
      title: this.title.value,
      beforeTitle: this.beforeTitle?.value ?? null,
      lead: this.lead.value,
      metaDesc: this.metaDesc.value,
      featuredImg: this.featuredImg.value,
      caption: this.caption.value,
      body: this.body.value,
      slug: this.slug.value,
      readTime: this.readTime.value,
      createdAt: this.createdAt?.value ?? null,
      updatedAt: this.updatedAt?.value ?? null,
      categoryId: this.categoryId.value,
      authorId: this.authorId.value,
      date: this.date.value,
      isFeatured: this.isFeatured.value,
    }
  }
}
