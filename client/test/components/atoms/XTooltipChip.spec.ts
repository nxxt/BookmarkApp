import Vuetify from 'vuetify'
import { mount, createLocalVue } from '@vue/test-utils'
import XTooltipChip from '@/components/atoms/XTooltipChip.vue'

const localVue = createLocalVue()

describe('XTooltipChip.vue', () => {
  // vuetify の準備
  let vuetify: typeof Vuetify
  beforeEach(() => {
    vuetify = new Vuetify()
  })

  // propsで渡す値の準備
  const propsData = {
    tooltip: 'test',
    classes: { test: true },
    color: 'dark'
  }

  const factory = (options?: any) => {
    return mount(XTooltipChip, {
      localVue,
      vuetify,
      ...options
    })
  }

  // TEST
  it('props', () => {
    // コンポーネントラッパーの作成
    const wrapper = factory({ propsData })

    // VueインスタンスのpropsがpropsDataと等しいか
    expect(wrapper.props()).toStrictEqual(propsData)
  })

  describe('template', () => {
    it('slot', () => {
      // コンポーネントラッパーの作成
      const wrapper = factory({
        slots: {
          default: '<div data-test="slotContent">slot content</div>'
        }
      })

      const slotContent = wrapper.find('[data-test="slotContent"]')
      expect(slotContent.exists()).toBe(true)
      expect(slotContent.text()).toBe('slot content')
    })

    it('snapshot', () => {
      // コンポーネントラッパーの作成
      const wrapper = factory({ propsData })

      // レンダリング結果が前回のスナップショットと同じか
      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})
