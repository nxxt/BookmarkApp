<template>
  <v-card
    :color="color"
    class="x-tag-edit-form"
    :style="{ width: `${isMobile ? '100%' : '90%'}` }"
  >
    <v-card-title class="d-flex flex-column justify-center">
      <v-icon x-large>mdi-tag</v-icon>
      <span class="caption">tags</span>
    </v-card-title>

    <v-card-text>
      <v-list flat dense :color="color">
        <v-list-item
          v-for="(item, index) in tagList"
          :key="item._id"
          dense
          :value="item._id"
        >
          <v-list-item-action class="my-0" @click.stop>
            <v-btn icon x-small @click.stop.prevent="edit(index, item)">
              <v-icon>{{
                editingIndex === index && editingItem._id === item._id
                  ? 'mdi-check'
                  : 'mdi-pencil'
              }}</v-icon>
            </v-btn>
          </v-list-item-action>

          <v-list-item-content class="py-0">
            <v-text-field
              v-if="editingIndex === index && editingItem._id === item._id"
              v-model="editingItem.name"
              autofocus
              flat
              background-color="transparent"
              hide-details
              solo
              dense
              height="23"
              @keyup.enter="edit(index, item)"
            />
            <span v-else class="pa-1 darker amber--text text--lighten-3">
              {{ `#${item.name}` }}
            </span>
          </v-list-item-content>

          <v-list-item-action-text>
            <span class="caption grey--text text--lighten-1">
              {{ getLinkNumber(item) }} items
            </span>
          </v-list-item-action-text>

          <v-list-item-action class="my-0" @click.stop>
            <v-btn
              icon
              x-small
              @click.stop.prevent="onTagDeleteBtnClick(item._id)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import IBookmark from '@@/types/IBookmark'
import ITag from '@@/types/ITag'
import { Component, Prop, Vue } from 'vue-property-decorator'
import XTooltipBtn from '@/components/atoms/XTooltipBtn.vue'
import { bookmarkStore, tagStore } from '@/store/index'

@Component({
  components: { XTooltipBtn }
})
export default class XTagEditForm extends Vue {
  editingIndex: number = -1
  editingItem: ITag = {
    _id: '',
    name: '',
    createdAt: '',
    updatedAt: '',
    createdBy: '',
    updatedBy: ''
  }

  defaultItem: ITag = {
    _id: '',
    name: '',
    createdAt: '',
    updatedAt: '',
    createdBy: '',
    updatedBy: ''
  }

  removing: string[] = []
  disabled: boolean = true

  @Prop({ type: Boolean, default: false })
  isMobile!: boolean

  @Prop({ type: String, default: '' })
  color!: string

  get allBookmarks(): Array<IBookmark> {
    return bookmarkStore.allBookmarks
  }

  get tagList(): Array<ITag> {
    return tagStore.tagList
  }

  /* edit中のtagをセット */
  async edit(index: number, item: ITag) {
    if (this.editingItem.name === '') {
      Object.assign(this.editingItem, item)
      this.editingIndex = index
    } else {
      if (this.editingItem.name !== item.name)
        await tagStore.updateTag({
          _id: this.editingItem._id,
          name: this.editingItem.name,
          createdAt: '',
          updatedAt: '',
          createdBy: this.$auth.user.id,
          updatedBy: this.$auth.user.id
        })
      Object.assign(this.editingItem, this.defaultItem)
      this.editingIndex = -1
    }
  }

  onTagDeleteBtnClick(_id: string) {
    if (
      process.browser &&
      window.confirm('フォルダを削除してよろしいですか？')
    ) {
      this.$emit('tag-delete-btn-click', _id)
    }
  }

  check(item: ITag) {
    return (
      this.editingItem.name !== '' &&
      this.editingItem.name === item.name &&
      this.editingItem._id === item._id
    )
  }

  getLinkNumber(tag: ITag) {
    const list = this.allBookmarks.filter((b: IBookmark) =>
      b.tag.some((d: string) => d === tag._id)
    )
    return list.length
  }
}
</script>

<style module>
.edit_name {
  font-size: 1.3rem;
}
</style>
