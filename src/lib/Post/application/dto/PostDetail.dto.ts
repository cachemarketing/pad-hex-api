export interface PostDetailDTO {
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
  }
  ogImg: string
}
