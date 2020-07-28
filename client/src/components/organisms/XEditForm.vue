<template>
  <v-card
    :color="color"
    class="x-edit-form"
    :style="{ width: `${isMobile ? '100%' : '90%'}` }"
  >
    <v-card-title>
      <x-tag-form
        v-model="editingItem.tag"
        @duplicate-tag-name="onDuplicateTagName"
      ></x-tag-form>
    </v-card-title>

    <v-card-text>
      <h4>Title</h4>
      <v-textarea
        v-model="editingItem.title"
        class="edit-title"
        placeholder="Insert a page title."
        dense
        auto-grow
        :rows="titleRow"
      />

      <h4>Memo</h4>
      <v-textarea
        v-model="editingItem.memo"
        class="edit-memo"
        placeholder="Insert a memo about page."
        dense
        auto-grow
        :rows="1"
      />

      <h4>URL</h4>
      <v-textarea
        v-model="editingItem.url"
        class="edit-url"
        placeholder="Insert a page URL."
        :rows="1"
        dense
        auto-grow
      />

      <br />

      <h4>Thumbnail</h4>
      <div>
        <div class="thumbnail-frame" :style="{ margin: '16px auto 0' }">
          <v-img
            :src="`http://localhost:5000/static/${editingItem.thumbnail}`"
            height="100%"
            width="100%"
            min-height="auto"
            max-height="auto"
          />
        </div>
      </div>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <x-tooltip-btn
        tooltip="save bookmark"
        @click="$emit('bookmark-save-btn-click', editingItem)"
      >
        save
      </x-tooltip-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Watch, Component, Prop, Vue } from 'vue-property-decorator'
import IBookmark from '@@/types/IBookmark'
import XTooltipBtn from '@/components/atoms/XTooltipBtn.vue'
import XTagForm from '@/components/organisms/XTagForm.vue'
@Component({
  components: { XTooltipBtn, XTagForm }
})
export default class XListArea extends Vue {
  disabled: boolean = true
  // TODO: データの持ち方検討
  editingItem: IBookmark = {
    _id: '',
    url: '',
    title: '',
    memo: '',
    domain: '',
    tag: [] as string[],
    folder: [] as string[],
    thumbnail: '',
    watchNumber: 0,
    articleCreatedAt: '',
    articleUpdatedAt: '',
    createdAt: '',
    updatedAt: '',
    createdBy: '',
    updatedBy: ''
  }

  defaultItem: IBookmark = {
    _id: '',
    url: '',
    title: '',
    memo: '',
    domain: '',
    tag: [] as string[],
    folder: [] as string[],
    thumbnail: '',
    watchNumber: 0,
    articleCreatedAt: '',
    articleUpdatedAt: '',
    createdAt: '',
    updatedAt: '',
    createdBy: '',
    updatedBy: ''
  }

  @Prop({ type: Object, default: () => ({}) })
  value!: IBookmark

  @Prop({ type: Boolean, default: false })
  isMobile!: boolean

  @Prop({ type: String, default: '' })
  color!: string

  get titleRow() {
    const l = this.editingItem.title.length
    if (l < 27) return 1
    else if (l < 54) return 2
    else return 3
  }

  @Watch('value', { immediate: true, deep: true })
  onValueChange(bookmark: IBookmark) {
    Object.assign(this.editingItem, this.defaultItem, bookmark)
  }

  onDuplicateTagName() {
    this.$emit('duplicate-tag-name')
  }
}
</script>

<style scoped>
.edit-title {
  font-size: 1.3rem;
}
.edit-memo {
  font-size: 0.9rem;
}
.edit-memo textarea {
  line-height: 0.8rem !important;
}
.edit-url {
  font-size: 0.9rem;
}
.thumbnail-frame {
  width: 70%;
  height: 150px;
}
</style>
