import Vuetify from 'vuetify'
import { createLocalVue, mount } from '@vue/test-utils'
import XEditArea from '@/components/organisms/XEditArea.vue'

const localVue = createLocalVue()

describe('XEditArea.vue', () => {
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
    isMobile: false
  }

  const factory = (options?: any) => {
    return mount(XEditArea, {
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

  describe('template', () => {
    it('slot', () => {
      const wrapper = factory({
        slots: {
          default: '<div data-test="slotContent">slot content</div>'
        }
      })

      const slotContent = wrapper.find('[data-test="slotContent"]')
      expect(slotContent.exists()).toBe(true)
      expect(slotContent.text()).toBe('slot content')
    })

    it('menu btn visible', () => {
      const wrapper = factory()
      const btn = wrapper.find('.x-edit-area-menu-btn')
      expect(btn.exists()).not.toBe(true)

      wrapper.setProps({ isMobile: true })

      wrapper.vm.$nextTick(() => {
        const btn = wrapper.find('.x-edit-area-menu-btn')
        expect(btn.exists()).toBe(true)
      })
    })
  })

  describe('emit', () => {
    it('container', () => {
      const wrapper = factory()
      const btn = wrapper.find('.container')
      const event = jest.fn()
      wrapper.vm.$on('edit-area-click', event)

      // 初期状態
      expect(event).toBeDefined() // イベントがundefinedでないこと
      expect(event).toHaveBeenCalledTimes(0) // eventが発生していないこと

      // emit
      btn.trigger('click')
      // イベント後
      expect(event).toHaveBeenCalledTimes(1) // イベントが親へ伝搬したこと
      expect(wrapper.emitted('edit-area-click')).toBeDefined()
    })

    it('menu btn', () => {
      const wrapper = factory({ propsData: { isMobile: true } })
      const btn = wrapper.find('.x-edit-area-menu-btn')
      const event = jest.fn()
      wrapper.vm.$on('menu-btn-click', event)

      // 初期状態
      expect(event).toBeDefined() // イベントがundefinedでないこと
      expect(event).toHaveBeenCalledTimes(0) // eventが発生していないこと

      wrapper.vm.$nextTick(() => {
        // emit
        // × btn.vm.$emit('click')
        btn.trigger('click')
        // イベント後
        expect(event).toHaveBeenCalledTimes(1) // イベントが親へ伝搬したこと
        expect(wrapper.emitted('menu-btn-click')).toBeDefined()
      })
    })

    it('arrow-left btn', () => {
      const wrapper = factory()
      const btn = wrapper.find('.x-edit-area-arrow-left-btn')
      const event = jest.fn()
      wrapper.vm.$on('arrow-left-btn-click', event)

      // 初期状態
      expect(event).toBeDefined() // イベントがundefinedでないこと
      expect(event).toHaveBeenCalledTimes(0) // eventが発生していないこと

      // emit
      btn.trigger('click')
      // イベント後
      expect(event).toHaveBeenCalledTimes(1) // イベントが親へ伝搬したこと
      expect(wrapper.emitted('arrow-left-btn-click')).toBeDefined()
    })
  })

  describe('the entire template', () => {
    it('snapshot', () => {
      const wrapper = factory({ propsData })
      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})
