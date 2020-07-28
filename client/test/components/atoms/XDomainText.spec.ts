import Vuetify from 'vuetify'
import { mount, createLocalVue } from '@vue/test-utils'
import XDomainText from '@/components/atoms/XDomainText.vue'

const localVue = createLocalVue()

describe('XDomainText.vue', () => {
  let vuetify: typeof Vuetify
  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const propsData = {
    text: 'test.com'
  }

  const factory = (options?: any) => {
    return mount(XDomainText, {
      localVue,
      vuetify,
      ...options
    })
  }

  it('props', () => {
    const wrapper = factory({ propsData })
    expect(wrapper.props()).toStrictEqual(propsData)
  })

  describe('template parts', () => {
    it('text', () => {
      const wrapper = factory({ propsData })
      const elm = wrapper.find('span')
      expect(elm.text()).toBe(propsData.text)
    })
  })

  describe('the entire template', () => {
    it('snapshot', () => {
      const wrapper = factory({ propsData })
      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})
