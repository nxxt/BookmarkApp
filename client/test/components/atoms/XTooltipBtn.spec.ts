import Vuetify from 'vuetify'
import { mount, createLocalVue } from '@vue/test-utils'
import XTooltipBtn from '@/components/atoms/XTooltipBtn.vue'

const localVue = createLocalVue()

describe('XTooltipBtn.vue', () => {
  let vuetify: typeof Vuetify
  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const propsData = {
    tooltip: 'test',
    classes: ['test']
  }

  const factory = (options?: any) => {
    return mount(XTooltipBtn, {
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

  describe('event', () => {
    const wrapper = factory()

    const event = jest.fn()
    wrapper.vm.$on('click', event)
    expect(event).toHaveBeenCalledTimes(0)

    wrapper.find('.v-btn').trigger('click')

    expect(event).toHaveBeenCalledTimes(1)
  })

  describe('the entire template', () => {
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

    it('snapshot', () => {
      const wrapper = factory({ propsData })
      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})
