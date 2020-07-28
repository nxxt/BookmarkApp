export default interface IBookmark {
  url: string;
  title: string;
  memo: string;
  tag: string[];
  folder: string[];
  domain: string;
  thumbnail: string;
  watchNumber: number;
  articleCreatedAt: string | null;
  articleUpdatedAt: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}
