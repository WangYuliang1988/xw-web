interface User {
  id: string
  name: string
  email: string
  image: string
  passwd: string
  admin: boolean
  createTime: number
}

interface Page {
  currentPage: number
  pageSize: number
  hasPrevious: boolean
  totalPage: number
  hasNext: boolean
}

interface Blog {
  id: string
  userId: string
  userName: string
  userImage: string
  name: string
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
