import Vuetify from 'vuetify'
import { mount, createLocalVue } from '@vue/test-utils'
import bookmark from '@@/test/mock_data/bookmark.json'
import filters from '@/utils/filters'
import XMemo from '@/components/atoms/XMemo.vue'

const localVue = createLocalVue()
Object.keys(filters).forEach((key: string) =>
  localVue.filter(key, filters[key])
)

describe('XMemo.vue', () => {
  let vuetify: typeof Vuetify
  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const propsData = {
    text: bookmark.memo
  }

  const factory = (options?: any) => {
    return mount(XMemo, {
      localVue,
      vuetify,
      ...options
    })
  }

  // TEST
  it('props', () => {
    const wrapper = factory({ propsData })
    expect(wrapper.props()).toStrictEqual(propsData)
  })

  describe('template parts', () => {
    it('text', () => {
      const wrapper = factory({ propsData })
      const elm = wrapper.find('span')
      expect(elm.text()).toBe(filters.textOverflow(propsData.text))
    })
  })

  describe('the entire template', () => {
    it('snapshot', () => {
      const wrapper = factory({ propsData })
      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})
