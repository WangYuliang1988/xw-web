interface User {
  id: string
  name: string
  email: string
  image: string
  passwd: string
  admin: boolean
  createTime: number
}

interface Blog {
  id: string
  userId: string
  userName: string
  userImage: string
  name: string
  author: string
  dynasty: string
  summary: string
  content: string
  html?: string
  comments?: Array<Comment>
  createTime: number
}

interface Comment {
  id: string
  content: string
  html?: string
  blogId: string
  userId: string
  userImage: string
  userName: string
  createTime: number
}

interface Page {
  currentPage: number
  pageSize: number
  hasPrevious: boolean
  totalPage: number
  hasNext: boolean
}

export type { User, Blog, Comment, Page }
