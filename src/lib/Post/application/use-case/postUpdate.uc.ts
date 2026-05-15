import { Post } from "../../domain/entity/post.entity"
import { PostNotFoundError } from "../../domain/errors/postNotFoundError.error"
import { PostRepository } from "../../domain/repository/post.repository"
import { PostAuthorId } from "../../domain/value-objects/postAuthorId.vo"
import { PostBeforeTitle } from "../../domain/value-objects/postBeforeTitle.vo"
import { PostBody } from "../../domain/value-objects/postBody.vo"
import { PostCaption } from "../../domain/value-objects/postCaption.vo"
import { PostCategoryId } from "../../domain/value-objects/postCategoryId.vo"
import { PostCreatedAt } from "../../domain/value-objects/postCreatedAt.vo"
import { PostDate } from "../../domain/value-objects/postDate.vo"
import { PostFeaturedImg } from "../../domain/value-objects/postFeaturedImg.vo"
import { PostId } from "../../domain/value-objects/postId.vo"
import { PostIsFeatured } from "../../domain/value-objects/postIsFeatured.vo"
import { PostLead } from "../../domain/value-objects/postLead.vo"
import { PostMetaDesc } from "../../domain/value-objects/postMetaDesc.vo"
import { PostOgImg } from "../../domain/value-objects/PostOgImg.vo"
import { PostReadTime } from "../../domain/value-objects/postReadTime.vo"
import { PostSlug } from "../../domain/value-objects/postSlug.vo"
import { PostTitle } from "../../domain/value-objects/postTitle.vo"
import { PostUpdatedAt } from "../../domain/value-objects/postUpdateAt.vo"
import { PostUpdateDTO } from "../dto/postUpdate.dto"

export class PostUpdate {
  constructor(private repository: PostRepository) {}

  async run(id: string, post: Partial<PostUpdateDTO>) {
    const exists = await this.repository.findById(new PostId(id))

    if (!exists) throw new PostNotFoundError("Post no encontrado")
    const updatePost = exists.update({
      id: new PostId(post.id ?? exists.id.value),
      title: new PostTitle(post.title ?? exists.title.value),
      beforeTitle: new PostBeforeTitle(
        post.beforeTitle ?? exists.beforeTitle?.value ?? null,
      ),
      caption: new PostCaption(post.caption ?? exists.caption.value),
      body: new PostBody(post.body ?? exists.body.value),
      lead: new PostLead(post.lead ?? exists.lead.value),
      slug: new PostSlug(post.title ?? exists.slug.value),
      featuredImg: new PostFeaturedImg(
        post.featuredImg ?? exists.featuredImg.value,
      ),
      metaDesc: new PostMetaDesc(post.metaDesc ?? exists.metaDesc.value),
      authorId: new PostAuthorId(post.authorId ?? exists.authorId.value),
      categoryId: new PostCategoryId(
        post.categoryId ?? exists.categoryId.value,
      ),
      date: new PostDate(post.date ?? exists.date.value),
      isFeatured: new PostIsFeatured(
        post.isFeatured ?? exists.isFeatured.value,
      ),
      readTime: new PostReadTime(post.readTime ?? exists.readTime.value),
      createdAt: new PostCreatedAt(exists.createdAt?.value ?? new Date()),
      updatedAt: new PostUpdatedAt(new Date()),
      ogImg: new PostOgImg(post.ogImg ?? exists.ogImg.value),
    })

    await this.repository.update(new PostId(id), updatePost)
  }
}
