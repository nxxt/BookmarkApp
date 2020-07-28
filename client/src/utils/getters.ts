import { bookmarkStore, tagStore, folderStore } from '@/store/index'
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
    else return 'green darken-2'
  },
  $getBookmarkById: (_id: string) => {
    return bookmarkStore.displayBookmarks.find((d) => d._id === _id)
  },
  $getTagById: (_id: string) => {
    return tagStore.tagList.find((d) => d._id === _id)
  },
  $getFolderById: (_id: string) => {
    return folderStore.folderList.find((d) => d._id === _id)
  }
}

export default getters
