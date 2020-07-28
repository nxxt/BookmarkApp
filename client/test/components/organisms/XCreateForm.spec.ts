import Vuetify from 'vuetify'
import { createLocalVue, mount } from '@vue/test-utils'
import XCreateForm from '@/components/organisms/XCreateForm.vue'
import filters from '@/utils/filters'
import mockGetters from '@/utils/mock_getters'

const localVue = createLocalVue()
Object.keys(filters).forEach((key: string) =>
  localVue.filter(key, filters[key])
)
Object.keys(mockGetters).forEach((key: string) => {
  localVue.prototype[key] = mockGetters[key]
})

describe('XCreateForm.vue', () => {
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
    color: 'darker',
    isMobile: false
  }

  const factory = (options?: any) => {
    return mount(XCreateForm, {
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

    it('text', () => {
      const wrapper = factory()
      const title = wrapper.find('.v-card__title')
      const label = wrapper.find('.v-card__text h4')
      const btn = wrapper.find('.v-btn__content')

      expect(title.text()).toBe('Create Bookmark')
      expect(label.text()).toBe('URL')
      expect(btn.text()).toBe('save')
    })

    it('isMobile', () => {
      const wrapper = factory()
      const elm = wrapper.find('.v-card')
      expect(elm.element.style.width).toBe('90%')
      wrapper.setProps({ isMobile: true })

      // propsセット後の変化を検査するにはnextTickが必要
      wrapper.vm.$nextTick(() => {
        expect(elm.element.style.width).toBe('100%')
      })
    })

    it('text-field', () => {
      const wrapper = factory()
      const input = wrapper.find('.v-text-field__slot input')
      const message = wrapper.find('.v-messages__wrapper')
      expect(input.attributes().placeholder).toBe(
        'Insert a link URL to any page.'
      )
      expect(message.text()).toBe('') // TODO:check
      expect(wrapper.vm.$data.url).toBe('')

      input.setValue('https://test.com')

      // propsセット後の変化を検査するにはnextTickが必要
      wrapper.vm.$nextTick(() => {
        expect(wrapper.vm.$data.url).toBe('https://test.com')
        expect(message.text()).toBe('')
      })
    })

    it('text-field empty', () => {
      const wrapper = factory()
      const field = wrapper.find('.v-text-field') // vmをもつ要素を取得するべし
      const fVm = field.vm as any
      expect(wrapper.vm.$data.url).toBe('')

      // field.setValue('')
      fVm.value = ''

      wrapper.vm.$nextTick(() => {
        fVm.$emit('change')

        expect(wrapper.vm.$data.url).toBe('')
        /* // labelがtransiton elementでtextがうまく取得できない
        const message = wrapper.find('.v-messages__wrapper')
        console.log(message.text())
        expect(message.text()).toBe('url is empty') */
      })
    })

    it('text-field invalid', () => {
      const wrapper = factory()
      const input = wrapper.find('.v-text-field__slot input')

      expect(wrapper.vm.$data.url).toBe('')

      input.setValue('fail_case')

      wrapper.vm.$nextTick(() => {
        expect(wrapper.vm.$data.url).toBe('fail_case')
        /* // labelがtransiton elementでtextがうまく取得できない
        const message = wrapper.find('.v-messages__message')
        expect(message.text()).toBe('invalid url') */
      })
    })

    it('btn clear disabled', () => {
      const wrapper = factory()
      const btn = wrapper.find('.v-btn')

      expect(btn.attributes().disabled).toBe('disabled')

      wrapper.setData({ url: 'https://test.com', valid: true })

      wrapper.vm.$nextTick(() => {
        expect(btn.attributes()).not.toContain('disabled')
      })
    })

    it('@click="onBtnClick"', () => {
      const mock = jest.fn()
      const wrapper = factory()
      wrapper.setMethods({ onBtnClick: mock })
      const btn = wrapper.find('.v-btn')
      // ↑【確認済】ここまでの時点でonBtnClickはmock化されている。

      // × btn.vm.$emit('click')  // triggerしてもmockのcallがカウントされない。
      // × btn.trigger('click')   // triggerしてもmockのcallがカウントされない。
      // set系のメソッド実行後はnextTickが必要？
      wrapper.vm.$nextTick(() => {
        // × btn.trigger('click') // triggerしてもmockのcallがカウントされない。WHY？
        btn.vm.$emit('click')
        expect(mock).toBeCalled()
      })
    })
  })

  describe('metohds', () => {
    it('onBtnClick', () => {
      const wrapper = factory({ propsData })
      const vm: any = wrapper.vm
      wrapper.setMethods({ isUrl: () => true })
      wrapper.setData({ url: 'test' })

      const event = jest.fn()
      vm.$on('url-save-btn-click', event)

      // 初期状態
      expect(event).toBeDefined() // イベントがundefinedでないこと
      expect(event).toHaveBeenCalledTimes(0) // eventが発生していないこと

      wrapper.vm.$nextTick(() => {
        // emit
        vm.onBtnClick()

        // イベント後
        expect(event).toHaveBeenCalledTimes(1) // イベントが親へ伝搬したこと
        const a = wrapper.emitted('url-save-btn-click')
        expect(a).toBeDefined()
        if (a) expect(a[0][0]).toEqual('test') // イベントのペイロードが正しいこと
      })
    })

    it('isUrl', () => {
      const wrapper = factory({ propsData })
      const vm: any = wrapper.vm
      expect(vm.isUrl('')).toBe('url is empty')
      expect(vm.isUrl('https://test.com')).toBe(true)
      expect(vm.isUrl('fail_test')).toBe('invalid url')
    })
  })

  describe('the entire template', () => {
    it('snapshot', () => {
      const wrapper = factory({ propsData })
      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})
