<template>
  <div class="x-list-group pa-0 ma-0">
    <div class="pl-2 d-flex align-center flex-wrap">
      <x-download-btn @click="onDownloadBtnClick" />

      <x-pulldown
        v-model="sort"
        items-type="object"
        :items="sortItems"
        color="darker"
        item-key="id"
        item-text-key="text"
        background-color="darker"
        dense
        solo
        width="200px"
        hide-details
        class="mb-2"
      />

      <v-spacer />

      <span class="mr-2 caption grey--text text--lighten-1">
        <strong class="subtitle-2 white--text">
          {{ items.length }}
        </strong>
        loaded /
        <strong class="subtitle-2 white--text">
          {{ listNumber }}
        </strong>
        items @{{ listName }}
      </span>
    </div>
    <v-divider />

    <v-list class="scroll" :class="color">
      <template v-for="item in items">
        <x-list-item
          :key="item._id"
          :ref="item._id"
          color="darker"
          :item="item"
          @checkbox-on="onCheckboxOn"
          @checkbox-off="onCheckboxOff"
          @bookmark-title-click="onBookmarkTitleClick"
          @hash-tag-click="onHashTagClick"
          @folder-text-click="onFolderTextClick"
          @browser-open-btn-click="onBrowserOpenBtnClick"
          @bookmark-edit-btn-click="onBookmarkEditBtnClick"
          @bookmark-remove-btn-click="onBookmarkRemoveBtnClick"
        />
        <v-divider :key="`d-${item._id}`" />
      </template>

      <v-list-item v-show="showLoading" class="text-center">
        <div
          ref="observe_element"
          class="d-flex flex-column align-center justify-center"
          :style="{ margin: '0 auto' }"
        >
          <v-progress-circular indeterminate color="primary" />
          loading...
        </div>
      </v-list-item>

      <v-list-item v-if="items.length === 0">
        <v-list-item-content class="ma-6 d-flex align-center justify-center">
          There is no data.
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue'
import { Watch, Component, Prop, PropSync, Vue } from 'vue-property-decorator'
import IBookmark from '@@/types/IBookmark'
import ISortType from '@@/types/ISortType'
import XDownloadBtn from '@/components/atoms/XDownloadBtn.vue'
import XPulldown from '@/components/atoms/Pulldown.vue'
import XListItem from '@/components/molecules/XListItem.vue'
import sortTypes from '@/assets/sortTypes.json'

@Component({
  components: { XDownloadBtn, XPulldown, XListItem }
})
export default class XListGroup extends Vue {
  sort: ISortType = sortTypes[0]
  sortItems: ISortType[] = sortTypes
  observer: IntersectionObserver = {} as IntersectionObserver

  @Prop({ type: Array as PropType<IBookmark[]>, default: () => [] })
  items!: IBookmark[]

  @Prop({ type: String, default: '' })
  listName!: string

  @Prop({ type: Number, default: 0 })
  listNumber!: number

  @Prop({ type: Boolean, default: true })
  showLoading!: boolean

  @Prop({ type: String, default: '' })
  color!: string

  @PropSync('selection', {
    type: Array as PropType<String[]>,
    default: () => []
  })
  syncedSelection!: string[]

  @Watch('sort')
  onSortTypeChange(val: ISortType) {
    this.$emit('sort-change', val)
  }

  @Watch('selection')
  onSelectionChange(val: string[]) {
    this.items.forEach((d) => {
      const list = this.$refs[d._id] as any
      list[0].setCheck(false)
    })
    if (val.length > 0)
      val.forEach((_id) => {
        const list = this.$refs[_id] as any
        list[0].setCheck(true)
      })
  }

  mounted() {
    this.observer = new IntersectionObserver((entries) => {
      const entry = entries[0]
      if (entry && entry.isIntersecting) {
        this.$emit('list-area-scroll')
      }
    })
    const observeElement: any = this.$refs.observe_element
    this.observer.observe(observeElement)
  }

  onDownloadBtnClick() {
    this.$emit('download-btn-click')
  }

  onCheckboxOn(_id: string) {
    this.syncedSelection.push(_id)
  }

  onCheckboxOff(_id: string) {
    const index = this.syncedSelection.indexOf(_id)
    if (index > -1) this.syncedSelection.splice(index, 1)
  }

  onBookmarkTitleClick(_id: string) {
    this.$emit('bookmark-title-click', _id)
  }

  onHashTagClick(_id: string) {
    this.$emit('hash-tag-click', _id)
  }

  onFolderTextClick(_id: string) {
    this.$emit('folder-text-click', _id)
  }

  onBrowserOpenBtnClick(_id: string) {
    this.$emit('browser-open-btn-click', _id)
  }

  onBookmarkEditBtnClick(_id: string) {
    this.$emit('bookmark-edit-btn-click', _id)
  }

  onBookmarkRemoveBtnClick(_id: string) {
    this.$emit('bookmark-remove-btn-click', _id)
  }
}
</script>
