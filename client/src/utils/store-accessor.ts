/* eslint-disable import/no-mutable-exports */
import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import Tag from '../store/tag'
import Bookmark from '../store/bookmark'
import Folder from '../store/folder'
import Page from '../store/page'

let tagStore: Tag
let bookmarkStore: Bookmark
let folderStore: Folder
let pageStore: Page
/**
 * ストアを初期化する（型推論できるモジュールとして取得する）
 * @param store Vuex.Store
 */
function initializeStores(store: Store<any>): void {
  // 型推論できるストアモジュール化
  tagStore = getModule(Tag, store)
  bookmarkStore = getModule(Bookmark, store)
  folderStore = getModule(Folder, store)
  pageStore = getModule(Page, store)
}

export { initializeStores, tagStore, bookmarkStore, folderStore, pageStore }
