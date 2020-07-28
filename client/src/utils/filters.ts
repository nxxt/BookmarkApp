import IBookmark from '~~/types/IBookmark'
import ITag from '~~/types/ITag'
import IFolder from '~~/types/IFolder'

const filters: { [key: string]: Function } = {
  bookmarkTitle: (bookmark: IBookmark) => {
    return bookmark && bookmark.title ? bookmark.title : ''
  },
  tagName: (tag: ITag) => {
    return tag && tag.name ? `#${tag.name}` : ''
  },
  folderName: (folder: IFolder) => {
    return folder && folder.name ? folder.name : ''
  },
  textOverflow: (str: string) => {
    return str.length > 140 ? `${str.substring(0, 140)}…` : str
  },
  dateFormat: (str: string) => {
    return str.substring(0, 10)
  }
}

export default filters
