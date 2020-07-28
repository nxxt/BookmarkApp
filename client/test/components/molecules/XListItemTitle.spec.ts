import Vuetify from 'vuetify'
import { mount, createLocalVue } from '@vue/test-utils'
import XListItemTitle from '@/components/molecules/XListItemTitle.vue'
import mockGetters from '@/utils/mock_getters'
import XTooltipChip from '@/components/atoms/XTooltipChip.vue'

// plugin 登録
const localVue = createLocalVue()
Object.keys(mockGetters).forEach((key: string) => {
  localVue.prototype[key] = mockGetters[key]
})

describe('XListItemTitle.vue', () => {
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
    _id: 'test_id',
    number: 10,
    text: 'test_text',
    url: 'test_url'
  }

  const factory = (options?: any) => {
    return mount(XListItemTitle, {
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
    // VueインスタンスのpropsがpropsDataと等しいか
    expect(wrapper.props()).toStrictEqual(propsData)
  })

  it('child component', () => {
    const wrapper = factory({ propsData })
    expect(wrapper.contains(XTooltipChip)).toBe(true)
  })

  describe('tooltip chip', () => {
    it('tooltip chip content', () => {
      const wrapper = factory({ propsData })
      const elm = wrapper.find('.x-tooltip-chip')

      expect(Number(elm.text())).toBe(propsData.number)
    })
  })

  describe('a (linked title)', () => {
    it('attrs and contents', () => {
      const wrapper = factory({ propsData })
      const elm = wrapper.find('a')

      // 初期状態の検証
      expect(elm.attributes().title).toBe(propsData.url)
      expect(elm.attributes().href).toBe(propsData.url)
      expect(elm.text()).toBe(propsData.text)
    })

    it('click event', () => {
      const wrapper = factory({ propsData })
      const event = jest.fn()
      const elm = wrapper.find('a')

      wrapper.vm.$on('click', event) // wrapperでclickイベント検知用

      // 初期状態の検証
      expect(event).toBeDefined() // イベントがundefinedでないこと
      expect(event).toHaveBeenCalledTimes(0) // eventが発生していないこと

      // Simulate a click on the elm
      elm.trigger('click')

      // 発生したイベントの検証
      expect(event).toHaveBeenCalledTimes(1) // イベントが親へ伝搬したこと
      const a = wrapper.emitted('click')
      expect(a).toBeDefined()
      if (a) expect(a[0][0]).toEqual(propsData._id) // イベントのペイロードが正しいこと
    })
  })

  describe('The entire template', () => {
    it('snapshot', () => {
      // コンポーネントラッパーの作成
      const wrapper = factory({ propsData })

      // レンダリング結果が前回のスナップショットと同じか
      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})
