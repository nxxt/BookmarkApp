import bookmarkList from '@@/test/mock_data/bookmarkList.json'
import tagList from '@@/test/mock_data/tagList.json'
import folderList from '@@/test/mock_data/folderList.json'
import IBookmark from '~~/types/IBookmark'
import ITag from '~~/types/ITag'
import IFolder from '~~/types/IFolder'

declare module 'vue/types/vue' {
  interface Vue {
    $getColorByNumber(number: number): string
    $getBookmarkById(_id: string): IBookmark
    $getTagById(_id: string): ITag
    $getFolderById(_id: string): IFolder
  }
}

const getters: { [key: string]: Function } = {
  $getColorByNumber: (number: number) => {
    if (number > 50) return 'red'
    else if (number > 10) return 'orange'
    else return 'blue'
  },
  $getBookmarkById: (_id: string) => {
    return bookmarkList.find((d) => d._id === _id)
  },
  $getTagById: (_id: string) => {
    return tagList.find((d) => d._id === _id)
  },
  $getFolderById: (_id: string) => {
    return folderList.find((d) => d._id === _id)
  }
}

export default getters
