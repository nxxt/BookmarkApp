import Vuetify from 'vuetify'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import bookmark from '@@/test/mock_data/bookmark.json'
import XListItem from '@/components/molecules/XListItem.vue'
import filters from '@/utils/filters'
import mockGetters from '@/utils/mock_getters'

const localVue = createLocalVue()
Object.keys(filters).forEach((key: string) =>
  localVue.filter(key, filters[key])
)
Object.keys(mockGetters).forEach((key: string) => {
  localVue.prototype[key] = mockGetters[key]
})

describe('XListItem.vue', () => {
  /****************
   * 準備
   ****************/
  // vuetify
  let vuetify: typeof Vuetify
  beforeEach(() => {
    vuetify = new Vuetify()
  })

  // propsで渡す値
  const propsData = {
    item: bookmark,
    color: 'darker'
  }

  const factory = (options?: any) => {
    return shallowMount(XListItem, {
      localVue,
      vuetify,
      ...options
    })
  }

  /****************
   * TEST
   ****************/
  it('props', () => {
    const wrapper = factory({ propsData })
    // console.log(wrapper.html())
    // VueインスタンスのpropsがpropsDataと等しいか
    expect(wrapper.props()).toStrictEqual(propsData)
  })

  describe('metohds', () => {
    it('onCheckboxInput', () => {
      const wrapper = factory({ propsData })
      const vm: any = wrapper.vm

      const eventOn = jest.fn()
      const eventOff = jest.fn()
      wrapper.vm.$on('checkbox-on', eventOn)
      wrapper.vm.$on('checkbox-off', eventOff)

      // 初期状態
      expect(eventOn).toBeDefined() // イベントがundefinedでないこと
      expect(eventOff).toBeDefined() // イベントがundefinedでないこと
      expect(eventOn).toHaveBeenCalledTimes(0) // eventが発生していないこと
      expect(eventOff).toHaveBeenCalledTimes(0) // eventが発生していないこと

      // emit
      vm.onCheckboxInput(true)

      // イベント後
      expect(eventOn).toHaveBeenCalledTimes(1) // イベントが親へ伝搬したこと
      const a = wrapper.emitted('checkbox-on')
      expect(a).toBeDefined()
      if (a) expect(a[0][0]).toEqual(wrapper.vm.$props.item._id) // イベントのペイロードが正しいこと

      // emit
      vm.onCheckboxInput(false)

      // イベント後
      expect(eventOff).toHaveBeenCalledTimes(1) // イベントが親へ伝搬したこと
      const b = wrapper.emitted('checkbox-off')
      expect(b).toBeDefined()
      if (b) expect(b[0][0]).toEqual(wrapper.vm.$props.item._id) // イベントのペイロードが正しいこと
    })

    it('onBookmarkTitleClick', () => {
      const wrapper = factory({ propsData })
      const vm: any = wrapper.vm

      const event = jest.fn()
      wrapper.vm.$on('bookmark-title-click', event)

      // 初期状態
      expect(event).toBeDefined() // イベントがundefinedでないこと
      expect(event).toHaveBeenCalledTimes(0) // eventが発生していないこと

      // emit
      vm.onBookmarkTitleClick(wrapper.vm.$props.item._id)

      // イベント後
      expect(event).toHaveBeenCalledTimes(1) // イベントが親へ伝搬したこと
      const a = wrapper.emitted('bookmark-title-click')
      expect(a).toBeDefined()
      if (a) expect(a[0][0]).toEqual(wrapper.vm.$props.item._id) // イベントのペイロードが正しいこと
    })

    it('onHashTagClick', () => {
      const wrapper = factory({ propsData })
      const vm: any = wrapper.vm

      const event = jest.fn()
      wrapper.vm.$on('hash-tag-click', event)

      // 初期状態
      expect(event).toBeDefined() // イベントがundefinedでないこと
      expect(event).toHaveBeenCalledTimes(0) // eventが発生していないこと

      // emit
      vm.onHashTagClick(wrapper.vm.$props.item._id)

      // イベント後
      expect(event).toHaveBeenCalledTimes(1) // イベントが親へ伝搬したこと
      const a = wrapper.emitted('hash-tag-click')
      expect(a).toBeDefined()
      if (a) expect(a[0][0]).toEqual(wrapper.vm.$props.item._id) // イベントのペイロードが正しいこと
    })

    it('onFolderTextClick', () => {
      const wrapper = factory({ propsData })
      const vm: any = wrapper.vm

      const event = jest.fn()
      wrapper.vm.$on('folder-text-click', event)

      // 初期状態
      expect(event).toBeDefined() // イベントがundefinedでないこと
      expect(event).toHaveBeenCalledTimes(0) // eventが発生していないこと

      // emit
      vm.onFolderTextClick(wrapper.vm.$props.item._id)

      // イベント後
      expect(event).toHaveBeenCalledTimes(1) // イベントが親へ伝搬したこと
      const a = wrapper.emitted('folder-text-click')
      expect(a).toBeDefined()
      if (a) expect(a[0][0]).toEqual(wrapper.vm.$props.item._id) // イベントのペイロードが正しいこと
    })

    it('onBrowserOpenBtnClick', () => {
      const wrapper = factory({ propsData })
      const vm: any = wrapper.vm

      const event = jest.fn()
      wrapper.vm.$on('browser-open-btn-click', event)

      // 初期状態
      expect(event).toBeDefined() // イベントがundefinedでないこと
      expect(event).toHaveBeenCalledTimes(0) // eventが発生していないこと

      // emit
      vm.onBrowserOpenBtnClick(wrapper.vm.$props.item._id)

      // イベント後
      expect(event).toHaveBeenCalledTimes(1) // イベントが親へ伝搬したこと
      const a = wrapper.emitted('browser-open-btn-click')
      expect(a).toBeDefined()
      if (a) expect(a[0][0]).toEqual(wrapper.vm.$props.item._id) // イベントのペイロードが正しいこと
    })

    it('onBookmarkEditBtnClick', () => {
      const wrapper = factory({ propsData })
      const vm: any = wrapper.vm

      const event = jest.fn()
      wrapper.vm.$on('bookmark-edit-btn-click', event)

      // 初期状態
      expect(event).toBeDefined() // イベントがundefinedでないこと
      expect(event).toHaveBeenCalledTimes(0) // eventが発生していないこと

      // emit
      vm.onBookmarkEditBtnClick(wrapper.vm.$props.item._id)

      // イベント後
      expect(event).toHaveBeenCalledTimes(1) // イベントが親へ伝搬したこと
      const a = wrapper.emitted('bookmark-edit-btn-click')
      expect(a).toBeDefined()
      if (a) expect(a[0][0]).toEqual(wrapper.vm.$props.item._id) // イベントのペイロードが正しいこと
    })

    it('onBookmarkRemoveBtnClick', () => {
      const wrapper = factory({ propsData })
      const vm: any = wrapper.vm

      const event = jest.fn()
      wrapper.vm.$on('bookmark-remove-btn-click', event)

      // 初期状態
      expect(event).toBeDefined() // イベントがundefinedでないこと
      expect(event).toHaveBeenCalledTimes(0) // eventが発生していないこと

      // emit
      vm.onBookmarkRemoveBtnClick(wrapper.vm.$props.item._id)

      // イベント後
      expect(event).toHaveBeenCalledTimes(1) // イベントが親へ伝搬したこと
      const a = wrapper.emitted('bookmark-remove-btn-click')
      expect(a).toBeDefined()
      if (a) expect(a[0][0]).toEqual(wrapper.vm.$props.item._id) // イベントのペイロードが正しいこと
    })
  })

  describe('the entire template', () => {
    it('snapshot', () => {
      const wrapper = factory({ propsData })
      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})
