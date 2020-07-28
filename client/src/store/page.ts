import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

// stateFactory: true → Vuex をモジュールモードで扱うために指定
@Module({
  stateFactory: true,
  namespaced: true,
  name: 'page'
})
export default class Pages extends VuexModule {
  private pageNo: number = 1
  private maxPage: number = 10
  private perPage: number = 10
  private itemTotal: number = 0

  get number() {
    return this.pageNo
  }

  get max() {
    return this.maxPage
  }

  get per() {
    return this.perPage
  }

  get total() {
    return this.itemTotal
  }

  // pageNo
  @Mutation
  private INCREMENT_NUMBER() {
    this.pageNo++
  }

  @Mutation
  private RESET_NUMBER() {
    this.pageNo = 1
  }

  @Action({})
  public incrementNumber() {
    this.INCREMENT_NUMBER()
  }

  @Action({})
  public resetNumber() {
    this.RESET_NUMBER()
  }

  // maxPage
  @Mutation
  private SET_MAX(max: number) {
    this.maxPage = max
  }

  @Mutation
  private RESET_MAX() {
    this.maxPage = 1
  }

  @Action({})
  public setMax(max: number) {
    this.SET_MAX(max)
  }

  @Action({})
  public resetMax() {
    this.RESET_MAX()
  }

  // perPage
  @Mutation
  private SET_PER_PAGE(perPage: number) {
    this.perPage = perPage
  }

  @Mutation
  private RESET_PER_PAGE() {
    this.perPage = 1
  }

  @Action({})
  public setPer(perPage: number) {
    this.SET_PER_PAGE(perPage)
  }

  @Action({})
  public resetPer() {
    this.RESET_PER_PAGE()
  }

  // itemTotal
  @Mutation
  private SET_TOTAL(itemTotal: number) {
    this.itemTotal = itemTotal
  }

  @Mutation
  private RESET_TOTAL() {
    this.itemTotal = 0
  }

  @Action({})
  public setTotal(itemTotal: number) {
    this.SET_TOTAL(itemTotal)
  }

  @Action({})
  public resetTotal() {
    this.RESET_TOTAL()
  }
}
