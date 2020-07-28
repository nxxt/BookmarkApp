import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import Folder from '@@/types/IFolder'
import DtoFolder from '@@/types/DtoFolder'
import { $axios } from '@/utils/api'

// stateFactory: true → Vuex をモジュールモードで扱うために指定
@Module({
  stateFactory: true,
  namespaced: true,
  name: 'folder'
})
export default class Folders extends VuexModule {
  private folders: Folder[] = []

  get folderList() {
    return this.folders
  }

  /**
   * Folder を state に格納する
   * @param folders Folder オブジェクト
   */
  @Mutation
  private FETCH(folders: Folder[]) {
    this.folders = folders
  }

  /**
   * Folder を追加する
   * @param folder Folder オブジェクト
   */
  @Mutation
  private CREATE(folder: Folder) {
    // リストに Folder を追加
    this.folders.push(folder)
  }

  /**
   * Folder を更新する
   * @param folder Folder オブジェクト
   */
  @Mutation
  private UPDATE(folder: Folder) {
    const target = this.folders.find((d) => d._id === folder._id)
    if (target) {
      const index = this.folders.indexOf(target)
      Object.assign(this.folders[index], folder)
    }
  }

  /**
   * Folder を削除する
   * @param _id 削除する Folder インスタンス
   */
  @Mutation
  private DELETE(_id: string) {
    const target = this.folders.find((d: Folder) => d._id === _id)
    if (target) {
      const index = this.folders.indexOf(target)
      this.folders.splice(index, 1)
    }
  }

  @Action({})
  public async fetchFolders(userId: string): Promise<void> {
    const items = await $axios.$get(`/api/v1/folders/lists/${userId}`)
    this.FETCH(items)
  }

  @Action({})
  async createFolder(folder: DtoFolder) {
    const item = await $axios.$post(`/api/v1/folders`, folder)
    this.CREATE(item)
    return item
  }

  @Action({})
  async updateFolder(folder: Folder) {
    const item = await $axios.$patch(`/api/v1/folders/${folder._id}`, folder)
    this.UPDATE(item)
    return item
  }

  @Action({})
  async deleteFolder(_id: string) {
    const data = await $axios.$delete(`/api/v1/folders/${_id}`)
    this.DELETE(_id)
    return data
  }
}
