<template>
  <v-container
    fluid
    class="x-mobile-view darkest pa-0 ma-0 d-flex"
    :style="{ position: 'relative', height: '100%' }"
  >
    <!-- Sidebar -->
    <transition name="left">
      <x-sidebar-area
        v-if="isSidebar"
        class="sidebar darkest"
        is-mobile
        @menu-btn-click="isSidebar = !isSidebar"
        @plus-btn-click="onBookmarkPlusBtnClick"
      >
        <slot name="sidebar"></slot>
      </x-sidebar-area>
    </transition>

    <!-- List -->
    <transition name="left">
      <x-list-area
        v-if="!isEditing"
        :filter.sync="syncedFilter"
        :display-type.sync="syncedDisplayType"
        class="list darker"
        is-mobile
        @list-area-click="isSidebar = false"
        @menu-btn-click="isSidebar = !isSidebar"
        @plus-btn-click="onBookmarkPlusBtnClick"
      >
        <slot name="list"></slot>
      </x-list-area>
    </transition>

    <!-- Edit -->
    <transition name="right">
      <x-edit-area
        v-if="isEditing"
        is-mobile
        class="edit darkest"
        @edit-area-click="isSidebar = false"
        @menu-btn-click="isSidebar = !isSidebar"
        @arrow-left-btn-click="onBookmarkArrowBtnClick"
      >
        <slot name="edit"></slot>
      </x-edit-area>
    </transition>
  </v-container>
</template>

<script lang="ts">
import { PropType } from 'vue'
import { Component, PropSync, Vue } from 'vue-property-decorator'
import ITag from '@@/types/ITag'
import IDisplayType from '@@/types/IDisplayType'
import XSidebarArea from '@/components/organisms/XSidebarArea.vue'
import XListArea from '@/components/organisms/XListArea.vue'
import XEditArea from '@/components/organisms/XEditArea.vue'

@Component({
  components: { XSidebarArea, XListArea, XEditArea }
})
export default class XMobileView extends Vue {
  isSidebar: boolean = false
  isEditing: boolean = false

  @PropSync('filter', {
    type: Array as PropType<(string | ITag)[]>,
    default: () => []
  })
  syncedFilter!: (string | ITag)[]

  @PropSync('displayType', {
    type: Object as PropType<IDisplayType>,
    default: () => ({ id: 0, text: '' })
  })
  syncedDisplayType!: IDisplayType

  // Event Handler
  onBookmarkPlusBtnClick() {
    this.toEditMode()
    this.$emit('plus-btn-click')
  }

  onBookmarkArrowBtnClick() {
    this.toListMode()
    this.$emit('arrow-left-btn-click')
  }

  toListMode() {
    this.isEditing = false
    this.isSidebar = false
  }

  toEditMode() {
    this.isEditing = true
    this.isSidebar = false
  }
}
</script>

<style scoped>
.container {
  position: relative;
  height: 100%;
}
.sidebar,
.list,
.edit {
  height: 100%;
}
.sidebar {
  position: absolute;
  width: 240px;
  z-index: 10;
}
.list {
  width: 100%;
}
.edit {
  width: 100%;
}
</style>
