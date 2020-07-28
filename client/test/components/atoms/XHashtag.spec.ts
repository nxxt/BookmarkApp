import Vuetify from 'vuetify'
import { mount, createLocalVue } from '@vue/test-utils'
import bookmark from '@@/test/mock_data/bookmark.json'
import filters from '@/utils/filters'
import mockGetters from '@/utils/mock_getters'
import XHashtag from '@/components/atoms/XHashtag.vue'

const localVue = createLocalVue()
Object.keys(filters).forEach((key: string) =>
  localVue.filter(key, filters[key])
)
Object.keys(mockGetters).forEach((key: string) => {
  localVue.prototype[key] = mockGetters[key]
})

describe('XHashtag.vue', () => {
  let vuetify: typeof Vuetify
  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const propsData = {
    items: bookmark.tag // tagのobjectId配列
  }

  const factory = (options?: any) => {
    return mount(XHashtag, {
      localVue,
      vuetify,
      ...options
    })
  }

  const translate = (_id: string) =>
    filters.tagName(mockGetters.$getTagById(_id))

  // TEST
  it('props', () => {
    const wrapper = factory({ propsData })
    expect(wrapper.props()).toStrictEqual(propsData)
  })

  describe('template parts', () => {
    it('text', () => {
      const wrapper = factory({ propsData })
      const elms = wrapper.findAll('.v-chip__content').wrappers
      elms.forEach((chip, i) =>
        expect(chip.text()).toBe(translate(propsData.items[i]))
      )
    })
  })

  describe('the entire template', () => {
    it('snapshot', () => {
      const wrapper = factory({ propsData })
      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})
