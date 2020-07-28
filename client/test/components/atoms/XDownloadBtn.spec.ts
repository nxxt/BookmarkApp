import Vuetify from 'vuetify'
import { mount, createLocalVue } from '@vue/test-utils'
import XDownloadBtn from '@/components/atoms/XDownloadBtn.vue'

const localVue = createLocalVue()

describe('XDownloadBtn.vue', () => {
  let vuetify: typeof Vuetify
  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const factory = (options?: any) => {
    return mount(XDownloadBtn, {
      localVue,
      vuetify,
      ...options
    })
  }

  // TEST
  describe('template parts', () => {
    it('text', () => {
      const wrapper = factory()
      const btn = wrapper.find('.v-btn')
      expect(btn.attributes().id).toBe('download')
    })
  })

  describe('event', () => {
    const wrapper = factory()

    const event = jest.fn()
    wrapper.vm.$on('click', event)
    expect(event).toHaveBeenCalledTimes(0)

    wrapper.find('.v-btn').trigger('click')

    expect(event).toHaveBeenCalledTimes(1)
  })

  describe('the entire template', () => {
    it('snapshot', () => {
      const wrapper = factory({})
      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})
