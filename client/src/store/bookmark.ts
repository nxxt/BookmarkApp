import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import Bookmark from '@@/types/IBookmark'
// import DtoBookmark from '@@/types/DtoBookmark'
import ISortType from '@@/types/ISortType'
import ITag from '@@/types/ITag'
import { $axios } from '@/utils/api'
// import IFolder from '~~/types/IFolder'

// stateFactory: true → Vuex をモジュールモードで扱うために指定
@Module({
  stateFactory: true,
  namespaced: true,
  name: 'bookmark'
})
export default class Bookmarks extends VuexModule {
  private all: Bookmark[] = []
  private unfoldered: Bookmark[] = []
  private display: Bookmark[] = []
  private folderId: string = ''

  get allBookmarks() {
    return this.all
  }

  get unfolderedBookmarks() {
    return this.unfoldered
  }

  get displayBookmarks() {
    return this.display
  }

  get _fId() {
    return this.folderId
  }

  /**
   * Bookmark を state に格納する
   * @param items Bookmark オブジェクト配列
   */
  @Mutation
  private FETCH_ALL(items: Bookmark[]) {
    this.all = items
  }

  /**
   * Bookmark を state に格納する
   * @param items Bookmark オブジェクト配列
   */
  @Mutation
  private FETCH_UNFOLDERED(items: Bookmark[]) {
    this.unfoldered = items
  }

  /**
   * Bookmark を state に格納する
   * @param items Bookmark オブジェクト配列
   */
  @Mutation
  private FETCH_DISPLAY(items: Bookmark[], folderId: string) {
    this.display = items
    this.folderId = folderId
  }

  /**
   * Bookmark を state に格納する
   * @param items Bookmark オブジェクト配列
   */
  @Mutation
  private ADD_DISPLAY(items: Bookmark[]) {
    this.display = [...this.display, ...items]
  }

  /**
   * Bookmark を追加する
   * @param bookmark Bookmark オブジェクト
   */
  @Mutation
  private CREATE(data: { bookmark: Bookmark; folderId: string }) {
    // リストに Bookmark を追加
    this.all.push(data.bookmark)
    this.unfoldered.push(data.bookmark)
    // 選択したsidemenuが「all bookmarks」「unfoldered」の場合
    if (['h-0', 'h-1'].includes(data.folderId)) {
      this.display.push(data.bookmark)
    }
  }

  /**
   * Bookmark を更新する
   * @param bookmark Bookmark オブジェクト
   */
  @Mutation
  private UPDATE(bookmark: Bookmark) {
    const target = this.all.find((d) => d._id === bookmark._id)
    if (target) {
      const index = this.all.indexOf(target)
      Object.assign(this.all[index], bookmark)
    }
    const target2 = this.unfoldered.find((d) => d._id === bookmark._id)
    if (target2) {
      const index = this.unfoldered.indexOf(target2)
      Object.assign(this.unfoldered[index], bookmark)
    }
    const target3 = this.display.find((d) => d._id === bookmark._id)
    if (target3) {
      const index = this.display.indexOf(target3)
      Object.assign(this.display[index], bookmark)
    }
  }

  /**
   * Bookmark を削除する
   * @param bookmark 削除する Bookmark インスタンス
   */
  @Mutation
  private DELETE(_id: string) {
    const target = this.all.find((d: Bookmark) => d._id === _id)
    if (target) {
      const index = this.all.indexOf(target)
      this.all.splice(index, 1)
    }
    const target2 = this.unfoldered.find((d: Bookmark) => d._id === _id)
    if (target2) {
      const index = this.unfoldered.indexOf(target2)
      this.unfoldered.splice(index, 1)
    }
    const target3 = this.display.find((d: Bookmark) => d._id === _id)
    if (target3) {
      const index = this.display.indexOf(target3)
      this.display.splice(index, 1)
    }
  }

  @Action({})
  public async fetchAllBookmarks(params: { userId: string }): Promise<void> {
    const data = await $axios.$get(`/api/v1/bookmarks/all/${params.userId}`)
    this.FETCH_ALL(data)
  }

  @Action({})
  public async fetchUnfolderedBookmarks(params: {
    userId: string
  }): Promise<void> {
    const data = await $axios.$get(
      `/api/v1/bookmarks/unfoldered/${params.userId}`
    )
    this.FETCH_UNFOLDERED(data)
  }

  @Action({})
  public async fetchDisplayBookmarks(params: {
    userId: string
    pageNo: number
    perPage: number
    folderId: string
    filter: (string | ITag)[]
    sort: ISortType
  }): Promise<any> {
    const { userId, pageNo, perPage, folderId, filter, sort } = params
    const res = await $axios.post(
      `/api/v1/bookmarks/list/${userId}?page_no=${pageNo}&per_page=${perPage}&folder_id=${folderId}`,
      { sort, filter }
    )
    this.FETCH_DISPLAY(res.data, params.folderId)
    return [res.data, Number(res.headers['x-list-total-length'])]
  }

  @Action({})
  public async addDisplayBookmarks(params: {
    userId: string
    pageNo: number
    perPage: number
    folderId: string
    filter: (string | ITag)[]
    sort: ISortType
  }): Promise<void> {
    const { userId, pageNo, perPage, folderId, filter, sort } = params

    const data = await $axios.$post(
      `/api/v1/bookmarks/list/${userId}?page_no=${pageNo}&per_page=${perPage}&folder_id=${folderId}`,
      { sort, filter }
    )
    this.ADD_DISPLAY(data)
  }

  @Action({})
  async createBookmark(data: {
    url: string
    userId: string
    folderId: string
  }) {
    const item = await $axios.$post(`/api/v1/bookmarks`, {
      url: data.url,
      userId: data.userId
    })
    this.CREATE({ bookmark: item, folderId: data.folderId })
    return item
  }

  @Action({})
  async updateBookmark(bookmark: Bookmark) {
    const item = await $axios.$patch(
      `/api/v1/bookmarks/${bookmark._id}`,
      bookmark
    )
    this.UPDATE(item)
    return item
  }

  @Action({})
  async deleteBookmark(_id: string) {
    const data = await $axios.$delete(`/api/v1/bookmarks/${_id}`)
    this.DELETE(_id)
    return data
  }
}
