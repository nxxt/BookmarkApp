export default interface IBookmark {
  _id: string
  url: string
  title: string
  memo: string
  tag: string[]
  folder: string[]
  domain: string
  thumbnail: string
  watchNumber: number
  articleCreatedAt: string
  articleUpdatedAt: string
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
}
