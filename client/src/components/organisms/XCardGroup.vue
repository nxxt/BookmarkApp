<template>
  <div class="x-card-group pa-0 ma-0">
    <div class="pl-2 d-flex align-center flex-wrap">
      <x-download-btn @click="onDownloadBtnClick" />

      <x-pulldown
        v-model="sort"
        items-type="object"
        :items="sortItems"
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

    <div class="scroll d-flex justify-start flex-wrap">
      <x-card-item
        v-for="item in items"
        :key="item._id"
        :ref="item._id"
        color="darker"
        :item="item"
        :is-mobile="isMobile"
        @checkbox-on="onCheckboxOn"
        @checkbox-off="onCheckboxOff"
        @bookmark-title-click="onBookmarkTitleClick"
        @hash-tag-click="onHashTagClick"
        @folder-text-click="onFolderTextClick"
        @browser-open-btn-click="onBrowserOpenBtnClick"
        @bookmark-edit-btn-click="onBookmarkEditBtnClick"
        @bookmark-remove-btn-click="onBookmarkRemoveBtnClick"
      />

      <div v-show="showLoading" :style="{ width: '100%' }">
        <div
          ref="observe_element2"
          class="d-flex flex-column align-center justify-center"
          :style="{ margin: '0 auto' }"
        >
          <v-progress-circular indeterminate color="primary" />
          loading...
        </div>
      </div>

      <v-list-item>
        <v-list-item-content
          v-if="items.length === 0"
          class="ma-6 d-flex align-center justify-center"
        >
          There is no data.
        </v-list-item-content>
      </v-list-item>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue'
import { Watch, Component, Prop, PropSync, Vue } from 'vue-property-decorator'
import IBookmark from '@@/types/IBookmark'
import ISortType from '@@/types/ISortType'
import XDownloadBtn from '@/components/atoms/XDownloadBtn.vue'
import XPulldown from '@/components/atoms/Pulldown.vue'
import XCardItem from '@/components/molecules/XCardItem.vue'
import sortTypes from '@/assets/sortTypes.json'

@Component({
  components: { XDownloadBtn, XPulldown, XCardItem }
})
export default class XCardGroup extends Vue {
  sort: ISortType = sortTypes[0]
  sortItems: ISortType[] = sortTypes
  observer: IntersectionObserver = {} as IntersectionObserver

  @Prop({ type: Array as PropType<IBookmark[]>, default: () => [] })
  items!: IBookmark[]

  @Prop({ type: String, default: '' })
  listName!: string

  @Prop({ type: Boolean, default: false })
  isMobile!: boolean

  @Prop({ type: Number, default: 0 })
  listNumber!: number

  @Prop({ type: Boolean, default: false })
  showLoading!: boolean

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
    const observeElement: any = this.$refs.observe_element2
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
    this.syncedSelection.splice(index, 1)
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
