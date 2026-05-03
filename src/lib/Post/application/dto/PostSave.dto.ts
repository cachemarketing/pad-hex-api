export interface PostSaveDTO {
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
  createdAt?: Date
  updatedAt?: Date
  categoryId: string
  authorId: string
  date: Date
  isFeatured: boolean
}
