import { randomUUID } from "node:crypto"
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
import { PostSaveDTO } from "../dto/PostSave.dto"
import { PostOgImg } from "../../domain/value-objects/PostOgImg.vo"

export class PostSave {
  constructor(private repository: PostRepository) {}

  async run(dto: PostSaveDTO) {
    const id = randomUUID()
    const post = new Post({
      id: new PostId(id),
      title: new PostTitle(dto.title),
      beforeTitle: new PostBeforeTitle(dto.beforeTitle ?? null),
      lead: new PostLead(dto.lead),
      metaDesc: new PostMetaDesc(dto.metaDesc),
      featuredImg: new PostFeaturedImg(dto.featuredImg),
      caption: new PostCaption(dto.caption),
      body: new PostBody(dto.body),
      slug: new PostSlug(dto.title),
      readTime: new PostReadTime(dto.readTime),
      categoryId: new PostCategoryId(dto.categoryId),
      authorId: new PostAuthorId(dto.authorId),
      date: new PostDate(dto.date),
      isFeatured: new PostIsFeatured(dto.isFeatured),
      ogImg: new PostOgImg(dto.ogImg),
    })

    return await this.repository.save(post)
  }
}
