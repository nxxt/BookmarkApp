<template>
  <v-combobox
    v-model="tagsOfBookmark"
    :items="tagList"
    :filter="filter"
    :hide-no-data="!search"
    :search-input.sync="search"
    item-text="name"
    hide-selected
    label="enter keyword"
    prepend-icon="mdi-tag"
    multiple
    small-chips
    solo
    dense
    clearable
  >
    <!-- v-combobox
      - v-model: textbox内に表示するchip, text情報のオブジェクト配列
      - :items: pulldown内に表示するchip, text情報のオブジェクト配列
      - :filter: methodsで定義したfilter関数
      - search: textboxに入力した文字列 検索にも使用
    -->

    <!--
        「pulldown内に選択するchipが無い」&「新規テキストを入力」時の
        pulldown内コンテンツ
        => textboxに入力したテキストを新規chip表示する

        変数: search
      -->
    <template v-slot:no-data>
      <v-list-item>
        <span class="mr-2 subheading">Create</span>
        <v-chip color="black--text amber lighten-3" label x-small>
          {{ search }}
        </v-chip>
      </v-list-item>
    </template>

    <!--
      「chipを選択中」時のtextbox内コンテンツ
      => 選択された要素（selection）をchip表示する
    -->
    <template v-slot:selection="{ attrs, item, parent, selected }">
      <v-chip
        v-if="item === Object(item)"
        v-bind="attrs"
        color="black--text amber lighten-3"
        :input-value="selected"
        label
        x-small
        class="mb-1"
      >
        <span class="pr-2">
          {{ item.name }}
        </span>
        <!-- textbox内のchipをpulldownへ戻す -->
        <v-icon x-small @click="parent.selectItem(item)">mdi-close</v-icon>
      </v-chip>
    </template>

    <!--
      「pulldown内に選択するchipがある」場合のpulldown内コンテンツ
      => chip（item）を表示する
    -->
    <template v-slot:item="{ index, item }">
      <v-chip
        v-if="editingTag !== item"
        color="black--text amber lighten-3"
        label
        x-small
      >
        {{ item.name }}
      </v-chip>

      <v-text-field
        v-else
        v-model="editingTag.name"
        autofocus
        flat
        background-color="transparent"
        hide-details
        solo
        dense
        @keyup.enter="edit(index, item)"
      />

      <v-spacer />
      <!-- <v-list-item-action @click.stop>
        <v-btn icon @click.stop.prevent="edit(index, item)">
          <v-icon>{{ editing !== item ? 'mdi-pencil' : 'mdi-check' }}</v-icon>
        </v-btn>
      </v-list-item-action> -->

      <span class="caption grey--text text--lighten-1">
        {{ getLinkNumber(item) }} items
      </span>
    </template>
  </v-combobox>
</template>

<script lang="ts">
import { PropType } from 'vue'
import { Watch, Component, Model, Vue } from 'vue-property-decorator'
import IBookmark from '@@/types/IBookmark'
import ITag from '@@/types/ITag'
import { tagStore, bookmarkStore } from '@/store/index'
import { $axios } from '@/utils/api'

type Tag = {
  header?: string
  _id: string
  name: string
}

@Component({})
export default class XTagForm extends Vue {
  // bookmarkに付与されたtag情報
  tagsOfBookmark: Tag[] = [{ _id: '', name: '' }]
  tagsOfDefault: Tag[] = [{ _id: '', name: '' }]
  search: string = '' // 検索キーワード

  editingTag: Tag = { _id: '', name: '' } as Tag // 編集中のタグitem
  editingIndex: number = -1 // 編集中のタグitemのitems中のindex値

  @Model('tag-change', { type: Array as PropType<string[]> })
  readonly value!: () => []

  get allBookmarks(): Array<IBookmark> {
    return bookmarkStore.allBookmarks
  }

  get tagList(): Array<Tag> {
    return [
      { header: 'select an chip / create one', _id: '', name: '' },
      ...tagStore.tagList.map((t) => ({ _id: t._id || '', name: t.name }))
    ]
  }

  @Watch('value', { immediate: true, deep: true })
  onValueChange(tags: string[]) {
    // propsで受け取ったtagのobjectId配列をTag表示用の配列へ変換
    this.tagsOfBookmark = tags.map((t: string) => {
      const target = this.$getTagById(t)
      return {
        _id: t,
        name: target && target.name ? target.name : ''
      }
    })
  }

  @Watch('tagsOfBookmark', { immediate: true, deep: true })
  async onTagsOfBookmarkChange(
    val: (string | Tag)[] = [],
    prev: (string | Tag)[] = []
  ) {
    if (val.length === prev.length) return

    this.tagsOfBookmark = await Promise.all(
      val.map(async (v: string | Tag) => {
        // textboxに入力された文字列はmodelにstringとして格納される
        if (typeof v === 'string') {
          const isName = await $axios.$post('/api/v1/tags/check_name', {
            _id: this.$auth.user.id,
            name: v
          })
          if (!isName) {
            const res = await tagStore.createTag({
              name: v,
              createdBy: this.$auth.user.id,
              updatedBy: this.$auth.user.id
            })
            v = {
              _id: res._id,
              name: res.name
            }
          } else {
            this.$emit('duplicate-tag-name')
            throw new Error('その名前のタグは存在しています。')
          }
        }
        return v
      })
    )

    const tags = this.tagsOfBookmark.map((t) => t._id)
    this.$emit('tag-change', tags)
  }

  /* itemのtextの中にqueryの文字列が入っているか */
  filter(
    item: Tag,
    queryText: string | number = '',
    itemText: string | number = ''
  ) {
    if (item.header) return false
    return itemText
      .toString()
      .toLowerCase()
      .includes(queryText.toString().toLowerCase())
  }

  /* edit中のtagをセット */
  /* edit(index: number, item: Tag) {
    if (!this.editingTag.name) {
      this.editingTag = item
      this.editingIndex = index
    } else {
      await tagStore.updateTag({
        _id: this.editingTag._id,
        name: this.editingTag.name,
        createdAt: '',
        updatedAt: '',
        createdBy: this.$auth.user.id,
        updatedBy: this.$auth.user.id
      })
      this.editingTag = { _id: '', name: '' }
      this.editingIndex = -1
    }
  } */

  getLinkNumber(tag: ITag) {
    const list = this.allBookmarks.filter((b: IBookmark) =>
      b.tag.some((d: string) => d === tag._id)
    )
    return list.length
  }
}
</script>
