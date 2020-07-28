import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import Tag from '@@/types/ITag'
import DtoTag from '@@/types/DtoTag'
import { $axios } from '@/utils/api'

// stateFactory: true → Vuex をモジュールモードで扱うために指定
@Module({
  stateFactory: true,
  namespaced: true,
  name: 'tag'
})
export default class Tags extends VuexModule {
  private tags: Tag[] = []

  get tagList() {
    return this.tags
  }

  /**
   * Tag を state に格納する
   * @param tags Tag オブジェクト
   */
  @Mutation
  private FETCH(tags: Tag[]) {
    this.tags = tags
  }

  /**
   * Tag を追加する
   * @param tag Tag オブジェクト
   */
  @Mutation
  private CREATE(tag: Tag) {
    // リストに Tag を追加
    this.tags.push(tag)
  }

  /**
   * Tag を更新する
   * @param tag Tag オブジェクト
   */
  @Mutation
  private UPDATE(tag: Tag) {
    const target = this.tags.find((d) => d._id === tag._id)
    if (target) {
      const index = this.tags.indexOf(target)
      Object.assign(this.tags[index], tag)
    }
  }

  /**
   * Tag を削除する
   * @param tag 削除する Tag インスタンス
   */
  @Mutation
  private DELETE(_id: string) {
    const target = this.tags.find((d: Tag) => d._id === _id)
    if (target) {
      const index = this.tags.indexOf(target)
      this.tags.splice(index, 1)
    }
  }

  @Action({})
  public async fetchTags(userId: string): Promise<void> {
    const items = await $axios.$get(`/api/v1/tags/lists/${userId}`)
    this.FETCH(items)
  }

  @Action({})
  async createTag(tag: DtoTag) {
    const item = await $axios.$post(`/api/v1/tags`, tag)
    this.CREATE(item)
    return item
  }

  @Action({})
  async updateTag(tag: Tag) {
    const item = await $axios.$patch(`/api/v1/tags/${tag._id}`, tag)
    this.UPDATE(item)
  }

  @Action({})
  async deleteTag(_id: string) {
    await $axios.$delete(`/api/v1/tags/${_id}`)
    this.DELETE(_id)
  }
}
