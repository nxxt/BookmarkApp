<template>
  <v-container
    fluid
    class="x-desktop-view darkest pa-0 ma-0 d-flex"
    :style="{ position: 'relative', height: '100%' }"
  >
    <!-- Sidebar -->
    <!-- <transition name="left"> -->
    <x-sidebar-area
      v-if="isSidebar"
      class="sidebar darkest"
      :style="{ zIndex: 2 }"
    >
      <slot name="sidebar"></slot>
    </x-sidebar-area>
    <!-- </transition> -->

    <!-- List -->
    <transition name="left">
      <x-list-area
        v-if="!(isSidebar && isEditing)"
        :filter.sync="syncedFilter"
        :display-type.sync="syncedDisplayType"
        class="list darker"
        :class="{ 'list_area-edit_area': !isSidebar && isEditing }"
        @plus-btn-click="onBookmarkPlusBtnClick"
      >
        <slot name="list"></slot>
      </x-list-area>
    </transition>

    <!-- Edit -->
    <transition name="right">
      <x-edit-area
        v-if="isEditing"
        class="edit darkest"
        :class="{ 'list_area-edit_area': !isSidebar && isEditing }"
        @arrow-left-btn-click="onBookmarkArrowLeftBtnClick"
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
export default class XDesktopView extends Vue {
  isSidebar: boolean = true
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
    this.toListEditMode()
    this.$emit('plus-btn-click')
  }

  onBookmarkArrowLeftBtnClick() {
    this.toSidebarListMode()
    this.$emit('arrow-left-btn-click')
  }

  // Area入替メソッド
  toSidebarListMode() {
    this.isSidebar = true
    this.isEditing = false
  }

  toListEditMode() {
    this.isSidebar = false
    this.isEditing = true
  }

  toSidebarEditMode() {
    this.isSidebar = true
    this.isEditing = true
  }
}
</script>

<style scoped>
.sidebar,
.list,
.edit {
  height: 100%;
}

.list.list_area-edit_area {
  width: 40%;
}
.edit.list_area-edit_area {
  width: 60%;
}

@media screen and (min-width: 600px) and (max-width: 800px) {
  .sidebar {
    position: relative;
    width: 240px;
    z-index: 0;
  }
  .list {
    width: calc(100% - 240px);
  }
  .edit {
    width: calc(100% - 240px);
  }
}

@media screen and (min-width: 800px) {
  .sidebar {
    position: relative;
    width: 270px;
    z-index: 0;
  }
  .list {
    width: calc(100% - 270px);
  }
  .edit {
    width: calc(100% - 270px);
  }
}
</style>
