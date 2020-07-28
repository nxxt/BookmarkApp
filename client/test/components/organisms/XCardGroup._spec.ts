import Vuetify from 'vuetify'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import bookmarkList from '@@/test/mock_data/bookmarkList.json'
import sortTypes from '@/assets/sortTypes.json'
import XCardGroup from '@/components/organisms/XCardGroup.vue'
import filters from '@/utils/filters'
import mockGetters from '@/utils/mock_getters'

const localVue = createLocalVue()
Object.keys(filters).forEach((key: string) =>
  localVue.filter(key, filters[key])
)
Object.keys(mockGetters).forEach((key: string) => {
  localVue.prototype[key] = mockGetters[key]
})

describe('XCardGroup.vue', () => {
  /****************
   * 準備
   ****************/
  // vuetify
  let vuetify: typeof Vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    const mockIntersectionObserver = jest.fn()
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null
    })
    window.IntersectionObserver = mockIntersectionObserver
  })

  // propsで渡す値
  const propsData = {
    items: bookmarkList,
    listName: 'test',
    isMobile: false,
    selection: []
  }

  const factory = (options?: any) => {
    return shallowMount(XCardGroup, {
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
    expect(wrapper.props()).toStrictEqual(propsData)
  })

  describe('watch', () => {
    it('sort', () => {
      const wrapper = factory({ propsData })
      const vm: any = wrapper.vm

      const event = jest.fn()
      vm.$on('sort-change', event)

      // 初期状態
      expect(event).toBeDefined() // イベントがundefinedでないこと
      expect(event).toHaveBeenCalledTimes(0) // eventが発生していないこと

      // change props (trigger event)
      wrapper.setData({ sort: sortTypes[1] })
      vm.onSortTypeChange(sortTypes[1])

      // イベント後
      vm.$nextTick(() => {
        expect(event).toHaveBeenCalledTimes(1) // イベントが親へ伝搬したこと
        const a = wrapper.emitted('sort-change')
        expect(a).toBeDefined()
        if (a) expect(a[0][0]).toEqual(sortTypes[1]) // イベントのペイロードが正しいこと
      })
    })
    it('selection', () => {})
  })

  describe('metohds', () => {
    it('onDownloadBtnClick', () => {
      const wrapper = factory({ propsData })
      const vm: any = wrapper.vm

      const event = jest.fn()
      vm.$on('download-btn-click', event)

      // 初期状態
      expect(event).toBeDefined() // イベントがundefinedでないこと
      expect(event).toHaveBeenCalledTimes(0) // eventが発生していないこと

      // emit
      vm.onDownloadBtnClick()

      // イベント後
      expect(event).toHaveBeenCalledTimes(1) // イベントが親へ伝搬したこと
      const a = wrapper.emitted('download-btn-click')
      expect(a).toBeDefined()
    })

    it('onCheckboxOn', () => {
      const wrapper = factory({ propsData })
      const vm: any = wrapper.vm

      // 初期状態
      expect(vm.syncedSelection.length).toBe(0)
      //
      vm.onCheckboxOn(vm.$props.items[0]._id)
      // イベント後
      expect(vm.syncedSelection[0]).toBe(vm.$props.items[0]._id)
    })

    it('onCheckboxOff', () => {
      const wrapper = factory({ propsData })
      const vm: any = wrapper.vm

      // 初期状態
      expect(vm.syncedSelection[0]).toBe(vm.$props.items[0]._id)
      //
      vm.onCheckboxOff(vm.$props.items[0]._id)
      // イベント後
      expect(vm.syncedSelection.length).toBe(0)
    })

    it('onBookmarkTitleClick', () => {
      const wrapper = factory({ propsData })
      const vm: any = wrapper.vm

      const event = jest.fn()
      vm.$on('bookmark-title-click', event)

      // 初期状態
      expect(event).toBeDefined() // イベントがundefinedでないこと
      expect(event).toHaveBeenCalledTimes(0) // eventが発生していないこと

      // emit
      vm.onBookmarkTitleClick(vm.$props.items[0]._id)

      // イベント後
      expect(event).toHaveBeenCalledTimes(1) // イベントが親へ伝搬したこと
      const a = wrapper.emitted('bookmark-title-click')
      expect(a).toBeDefined()
      if (a) expect(a[0][0]).toEqual(vm.$props.items[0]._id) // イベントのペイロードが正しいこと
    })

    it('onHashTagClick', () => {
      const wrapper = factory({ propsData })
      const vm: any = wrapper.vm

      const event = jest.fn()
      vm.$on('hash-tag-click', event)

      // 初期状態
      expect(event).toBeDefined() // イベントがundefinedでないこと
      expect(event).toHaveBeenCalledTimes(0) // eventが発生していないこと

      // emit
      vm.onHashTagClick(vm.$props.items[0]._id)

      // イベント後
      expect(event).toHaveBeenCalledTimes(1) // イベントが親へ伝搬したこと
      const a = wrapper.emitted('hash-tag-click')
      expect(a).toBeDefined()
      if (a) expect(a[0][0]).toEqual(vm.$props.items[0]._id) // イベントのペイロードが正しいこと
    })

    it('onFolderTextClick', () => {
      const wrapper = factory({ propsData })
      const vm: any = wrapper.vm

      const event = jest.fn()
      vm.$on('folder-text-click', event)

      // 初期状態
      expect(event).toBeDefined() // イベントがundefinedでないこと
      expect(event).toHaveBeenCalledTimes(0) // eventが発生していないこと

      // emit
      vm.onFolderTextClick(vm.$props.items[0]._id)

      // イベント後
      expect(event).toHaveBeenCalledTimes(1) // イベントが親へ伝搬したこと
      const a = wrapper.emitted('folder-text-click')
      expect(a).toBeDefined()
      if (a) expect(a[0][0]).toEqual(vm.$props.items[0]._id) // イベントのペイロードが正しいこと
    })

    it('onBrowserOpenBtnClick', () => {
      const wrapper = factory({ propsData })
      const vm: any = wrapper.vm

      const event = jest.fn()
      vm.$on('browser-open-btn-click', event)

      // 初期状態
      expect(event).toBeDefined() // イベントがundefinedでないこと
      expect(event).toHaveBeenCalledTimes(0) // eventが発生していないこと

      // emit
      vm.onBrowserOpenBtnClick(vm.$props.items[0]._id)

      // イベント後
      expect(event).toHaveBeenCalledTimes(1) // イベントが親へ伝搬したこと
      const a = wrapper.emitted('browser-open-btn-click')
      expect(a).toBeDefined()
      if (a) expect(a[0][0]).toEqual(vm.$props.items[0]._id) // イベントのペイロードが正しいこと
    })

    it('onBookmarkEditBtnClick', () => {
      const wrapper = factory({ propsData })
      const vm: any = wrapper.vm

      const event = jest.fn()
      vm.$on('bookmark-edit-btn-click', event)

      // 初期状態
      expect(event).toBeDefined() // イベントがundefinedでないこと
      expect(event).toHaveBeenCalledTimes(0) // eventが発生していないこと

      // emit
      vm.onBookmarkEditBtnClick(vm.$props.items[0]._id)

      // イベント後
      expect(event).toHaveBeenCalledTimes(1) // イベントが親へ伝搬したこと
      const a = wrapper.emitted('bookmark-edit-btn-click')
      expect(a).toBeDefined()
      if (a) expect(a[0][0]).toEqual(vm.$props.items[0]._id) // イベントのペイロードが正しいこと
    })

    it('onBookmarkRemoveBtnClick', () => {
      const wrapper = factory({ propsData })
      const vm: any = wrapper.vm

      const event = jest.fn()
      vm.$on('bookmark-remove-btn-click', event)

      // 初期状態
      expect(event).toBeDefined() // イベントがundefinedでないこと
      expect(event).toHaveBeenCalledTimes(0) // eventが発生していないこと

      // emit
      vm.onBookmarkRemoveBtnClick(vm.$props.items[0]._id)

      // イベント後
      expect(event).toHaveBeenCalledTimes(1) // イベントが親へ伝搬したこと
      const a = wrapper.emitted('bookmark-remove-btn-click')
      expect(a).toBeDefined()
      if (a) expect(a[0][0]).toEqual(vm.$props.items[0]._id) // イベントのペイロードが正しいこと
    })
  })

  describe('the entire template', () => {
    it('snapshot', () => {
      const wrapper = factory({ propsData })
      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})
