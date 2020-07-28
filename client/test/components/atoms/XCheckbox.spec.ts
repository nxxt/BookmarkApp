import Vuetify from 'vuetify'
import { mount, createLocalVue } from '@vue/test-utils'
import XCheckbox from '@/components/atoms/XCheckbox.vue'

const localVue = createLocalVue()

describe('XCheckbox.vue', () => {
  // vuetify の準備
  let vuetify: typeof Vuetify
  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const factory = (options?: any) => {
    return mount(XCheckbox, {
      localVue,
      vuetify,
      ...options
    })
  }

  it('input event', () => {
    const wrapper = factory()
    const event = jest.fn()
    const elm = wrapper.find('.x-checkbox.v-simple-checkbox')

    wrapper.vm.$on('input', event) // wrapperでイベント検知設定

    // 初期状態の検証
    expect(event).toBeDefined() // イベントがundefinedでないこと
    expect(event).toHaveBeenCalledTimes(0) // eventが発生していないこと
    expect(wrapper.vm.$data.isChecked).toBe(false)

    // [1] Simulate a click on the elm
    elm.trigger('click')

    // イベント後の検証
    expect(event).toHaveBeenCalledTimes(1) // イベントが親へ伝搬したこと
    const a = wrapper.emitted('input')
    expect(a).toBeDefined()
    if (a) expect(a[0][0]).toEqual(true) // イベントのペイロードが正しいこと

    // [2] Simulate a click on the elm
    elm.trigger('click')

    // イベント後の検証
    expect(event).toHaveBeenCalledTimes(2) // イベントが親へ伝搬したこと
    if (a) expect(a[1][0]).toEqual(false) // イベントのペイロードが正しいこと
  })

  describe('method', () => {
    it('toggle', () => {
      const wrapper = factory()
      const vm: any = wrapper.vm

      // 初期状態の検証
      expect(wrapper.vm.$data.isChecked).toBe(false)

      // [1]
      vm.setCheck(true)

      // 検証
      expect(wrapper.vm.$data.isChecked).toBe(true)

      // [2]
      vm.setCheck(false)

      // 検証
      expect(wrapper.vm.$data.isChecked).toBe(false)
    })
  })
  describe('the entire template', () => {
    it('snapshot', () => {
      const wrapper = factory()
      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})
