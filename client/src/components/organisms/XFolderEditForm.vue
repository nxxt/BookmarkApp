<template>
  <v-card
    :color="color"
    class="x-folder-edit-form"
    :style="{ width: `${isMobile ? '100%' : '90%'}` }"
  >
    <v-card-title class="d-flex flex-column justify-center">
      <v-icon x-large>mdi-folder-outline</v-icon>
      <span class="caption">{{ editingItem.name }}</span>
    </v-card-title>

    <v-card-text>
      <h4>Name</h4>
      <v-text-field
        v-model="editingItem.name"
        :class="$style.edit_name"
        placeholder="Insert a folder name."
      />
    </v-card-text>

    <v-card-text>
      <h4>Bookmarks</h4>
      <v-list flat dense :color="color">
        <v-list-item-group
          v-model="removing"
          multiple
          active-class="grey--text"
        >
          <template v-for="_id in editingItem.items">
            <v-list-item :key="_id" :value="_id">
              <template v-slot:default="{ active }">
                <v-list-item-content>
                  <v-list-item-title>
                    {{ $getBookmarkById(_id) | bookmarkTitle }}
                  </v-list-item-title>
                </v-list-item-content>

                <v-list-item-action>
                  <v-icon v-if="!active" color="darker">
                    mdi-check
                  </v-icon>

                  <v-icon v-else color="grey">
                    mdi-check
                  </v-icon>
                </v-list-item-action>
              </template>
            </v-list-item>
          </template>
        </v-list-item-group>
      </v-list>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <x-tooltip-btn tooltip="save folder info" @click="onSaveBtnClick">
        save
      </x-tooltip-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import IBookmark from '@@/types/IBookmark'
import IFolder from '@@/types/IFolder'
import { Component, Watch, Prop, Vue } from 'vue-property-decorator'
import XTooltipBtn from '@/components/atoms/XTooltipBtn.vue'
import { bookmarkStore } from '@/store/index'

@Component({
  components: { XTooltipBtn }
})
export default class XFolderEditForm extends Vue {
  editingItem: IFolder = {
    _id: '',
    name: '',
    items: [] as Array<string>,
    createdAt: '',
    updatedAt: '',
    createdBy: '',
    updatedBy: ''
  }

  defaultItem: IFolder = {
    _id: '',
    name: '',
    items: [] as Array<string>,
    createdAt: '',
    updatedAt: '',
    createdBy: '',
    updatedBy: ''
  }

  removing: string[] = []
  disabled: boolean = true

  @Prop({ type: Object, default: () => ({}) })
  value!: boolean

  @Prop({ type: Boolean, default: false })
  isMobile!: boolean

  @Prop({ type: String, default: '' })
  color!: string

  get allBookmarks(): Array<IBookmark> {
    return bookmarkStore.allBookmarks
  }

  @Watch('value', { immediate: true, deep: true })
  onValueChange(folder: IFolder) {
    Object.assign(this.editingItem, this.defaultItem, folder)
  }

  onSaveBtnClick() {
    this.editingItem.items = this.editingItem.items.filter(
      (_id) => !this.removing.includes(_id)
    )
    this.$emit('folder-save-btn-click', this.editingItem, this.removing)
  }
}
</script>

<style module>
.edit_name {
  font-size: 1.3rem;
}
</style>
