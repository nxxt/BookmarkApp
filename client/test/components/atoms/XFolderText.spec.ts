import Vuetify from 'vuetify'
import { mount, createLocalVue } from '@vue/test-utils'
import bookmark from '@@/test/mock_data/bookmark.json'
import filters from '@/utils/filters'
import mockGetters from '@/utils/mock_getters'
import XFolderText from '@/components/atoms/XFolderText.vue'

// filter, plugin 登録
const localVue = createLocalVue()
Object.keys(filters).forEach((key: string) =>
  localVue.filter(key, filters[key])
)
Object.keys(mockGetters).forEach((key: string) => {
  localVue.prototype[key] = mockGetters[key]
})

describe('XFolderText.vue', () => {
  // vuetify の準備
  let vuetify: typeof Vuetify
  beforeEach(() => {
    vuetify = new Vuetify()
  })

  // propsで渡す値の準備
  const propsData = {
    items: bookmark.folder // folderのobjectId配列
  }

  const factory = (options?: any) => {
    return mount(XFolderText, {
      localVue,
      vuetify,
      ...options
    })
  }

  /* const translate = (_id: string) => {
    return filters.folderName(mockGetters.$getFolderById(_id))
  } */

  // TEST
  it('props', () => {
    const wrapper = factory({ propsData })
    expect(wrapper.props()).toStrictEqual(propsData)
  })

  // TODO: spanのtextが取得できない
  /* describe('template parts', () => {
    it('text', () => {
      const wrapper = factory({ propsData })
      const elms = wrapper.findAll('span').wrappers
      elms.forEach((span, i) => {
        if (i === elms.length - 1) {
          console.log(span.text())
          expect(span.text()).toBe(`${translate(propsData.items[i])},`)
        } else {
          console.log(span.text())
          expect(span.text()).toBe(translate(propsData.items[i]))
        }
      })
      const elm = wrapper.find('.x-folder-text span')
      expect(elm.text()).toBe(translate(propsData.items[0]))
    })
  }) */

  describe('the entire template', () => {
    it('snapshot', () => {
      const wrapper = factory({ propsData })
      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})
