// import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount, createLocalVue } from '@vue/test-utils'
import XDateText from '@/components/atoms/XDateText.vue'
import filters from '@/utils/filters'

const localVue = createLocalVue()
Object.keys(filters).forEach((key: string) =>
  localVue.filter(key, filters[key])
)

describe('XDateText.vue', () => {
  let vuetify: typeof Vuetify
  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const propsData = {
    text: '2020-06-24T00:00:00'
  }

  const factory = (options?: any) => {
    return mount(XDateText, {
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
      expect(elm.text()).toBe(`${filters.dateFormat(propsData.text)}`)
    })
  })

  describe('the entire template', () => {
    it('snapshot', () => {
      const wrapper = factory({ propsData })
      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})
