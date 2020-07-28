<template>
  <div
    draggable
    :class="$style.list_item"
    class="d-flex flex-row py-3"
    @dragstart="dragList($event, item)"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <!-- header checkbox-->
    <div
      :class="$style.list_item_header"
      class="d-flex align-center justify-start"
    >
      <x-checkbox ref="checkbox" @input="onCheckboxInput" />
    </div>

    <!-- main content -->
    <div
      :class="$style.list_item_content"
      class="pr-1 d-flex flex-column align-start justify-space-around"
    >
      <x-list-item-title
        class="subtitle-1"
        :_id="item._id"
        :number="item.watchNumber"
        :text="item.title"
        :url="item.url"
        @click="onBookmarkTitleClick"
      />

      <div
        v-if="item.memo.length > 0"
        class="caption grey--text text--lighten-1"
      >
        <x-memo :text="item.memo" />
      </div>

      <div v-if="item.tag.length > 0">
        <x-hashtag :items="item.tag" @click="onHashTagClick" />
      </div>

      <div
        class="d-flex align-center flex-wrap caption grey--text text--lighten-1"
      >
        <template v-if="item.folder.length > 0">
          <x-folder-text :items="item.folder" @click="onFolderTextClick" />
          <span>・</span>
        </template>

        <template v-if="item.domain">
          <x-domain-text :text="item.domain" />
          <span>・</span>
        </template>

        <template v-if="item.createdAt">
          <x-date-text :text="item.createdAt" />
        </template>
      </div>
    </div>

    <!-- hover -->
    <div
      v-if="hover"
      :class="$style.list_item_hover"
      class="px-4 d-flex align-center justify-end darker"
    >
      <x-tooltip-btn
        :classes="['browser_open_btn']"
        icon
        link
        tag="a"
        :href="item.url"
        target="_blank"
        tooltip="open"
        @click="onBrowserOpenBtnClick(item._id)"
      >
        <v-icon>mdi-open-in-new</v-icon>
      </x-tooltip-btn>

      <x-tooltip-btn
        :classes="['bookmark_edit_btn']"
        tooltip="edit"
        icon
        @click="onBookmarkEditBtnClick(item._id)"
      >
        <v-icon>mdi-pencil</v-icon>
      </x-tooltip-btn>

      <x-tooltip-btn
        :classes="['bookmark_remove_btn']"
        tooltip="delete"
        icon
        @click="onBookmarkRemoveBtnClick(item._id)"
      >
        <v-icon>mdi-delete</v-icon>
      </x-tooltip-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue'
import { Component, Prop, Vue } from 'vue-property-decorator'
import IBookmark from '@@/types/IBookmark'

import XCheckbox from '@/components/atoms/XCheckbox.vue'
import XMemo from '@/components/atoms/XMemo.vue'
import XHashtag from '@/components/atoms/XHashtag.vue'
import XFolderText from '@/components/atoms/XFolderText.vue'
import XDomainText from '@/components/atoms/XDomainText.vue'
import XDateText from '@/components/atoms/XDateText.vue'
import XTooltipBtn from '@/components/atoms/XTooltipBtn.vue'
import XListItemTitle from '@/components/molecules/XListItemTitle.vue'

@Component({
  components: {
    XCheckbox,
    XMemo,
    XHashtag,
    XFolderText,
    XDomainText,
    XDateText,
    XTooltipBtn,
    XListItemTitle
  }
})
export default class XListItem extends Vue {
  hover: boolean = false

  @Prop({ type: Object as PropType<IBookmark>, default: () => ({}) })
  item!: IBookmark

  @Prop({ type: String, default: '' })
  color!: string

  // darag & drop
  dragList(event: Event & { dataTransfer?: any }, item: IBookmark) {
    event.dataTransfer.setData('bookmarkId', item._id)
  }

  // checkbox
  onCheckboxInput(isChecked: boolean): void {
    if (isChecked) this.$emit('checkbox-on', this.item._id)
    else this.$emit('checkbox-off', this.item._id)
  }

  // list content
  onBookmarkTitleClick(_id: string) {
    this.$emit('bookmark-title-click', _id)
  }

  onHashTagClick(_id: string) {
    this.$emit('hash-tag-click', _id)
  }

  onFolderTextClick(_id: string) {
    this.$emit('folder-text-click', _id)
  }

  // hover
  onBrowserOpenBtnClick(_id: string) {
    this.$emit('browser-open-btn-click', _id)
  }

  onBookmarkEditBtnClick(_id: string) {
    this.$emit('bookmark-edit-btn-click', _id)
  }

  onBookmarkRemoveBtnClick(_id: string) {
    this.$emit('bookmark-remove-btn-click', _id)
  }

  setCheck(isCheck: boolean) {
    const checkbox = this.$refs.checkbox as XCheckbox
    checkbox.setCheck(isCheck)
  }
}
</script>

<style module>
.list_item {
  position: relative;
  width: 100%;
}
.list_item_header {
  width: 30px;
}
.list_item_content {
  width: calc(100% - 30px);
}
.list_item_hover {
  position: absolute;
  top: 0;
  right: 0;
  width: auto;
  opacity: 0.8;
  height: 100%;
}
</style>
