<template>
  <v-container fluid>
    <v-combobox
      v-model="model"
      :items="items"
      :filter="filter"
      :hide-no-data="!search"
      :search-input.sync="search"
      label="Search for an option"
      hide-selected
      multiple
      small-chips
      solo
    >
      <!--
        - model: textbox内に表示するchip, text情報のオブジェクト配列
        - items: pulldown内に表示するchip, text情報のオブジェクト配列
        - filter: methodsで定義したfilter関数
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
          <span class="subheading">Create</span>
          <v-chip color="cyan" label small>
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
          :color="`${item.color}`"
          :input-value="selected"
          label
          small
        >
          <span class="pr-2">
            {{ item.text }}
          </span>
          <v-icon small @click="parent.selectItem(item)">
            mdi-close
          </v-icon>
        </v-chip>
      </template>

      <!--
        「pulldown内に選択するchipがある」場合のpulldown内コンテンツ
        => chip（item）を表示する
      -->
      <template v-slot:item="{ index, item }">
        <!--  -->
        <v-text-field
          v-if="editing === item"
          v-model="editing.text"
          autofocus
          flat
          background-color="transparent"
          hide-details
          solo
          @keyup.enter="edit(index, item)"
        ></v-text-field>
        <!--  -->
        <v-chip v-else :color="item.color" dark label small>
          {{ item.text }}
        </v-chip>

        <v-spacer></v-spacer>

        <v-list-item-action @click.stop>
          <v-btn icon @click.stop.prevent="edit(index, item)">
            <v-icon>{{ editing !== item ? 'mdi-pencil' : 'mdi-check' }}</v-icon>
          </v-btn>
        </v-list-item-action>
      </template>
    </v-combobox>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
type Tag = {
  header?: string
  text: string
  color: string
}
export default Vue.extend({
  data: () => ({
    // textbox内に表示するchip, text情報のオブジェクト配列
    model: [{ text: 'Foo', color: 'cyan' }],
    // pulldown内に表示するchip, text情報のオブジェクト配列
    items: [
      { header: 'Select an option or create one' },
      { text: 'Foo', color: 'cyan' },
      { text: 'Bar', color: 'cyan' }
    ],
    // textboxに入力した文字列
    search: '',
    // 編集中のタグ
    editing: { text: '', color: '' } as Tag,
    index: -1

    // activator: null,
    // attach: null,
    // nonce: 1,
    // menu: false
    // x: 0,
    // y: 0
  }),

  watch: {
    model(val, prev) {
      if (val.length === prev.length) return

      this.model = val.map((v: Tag | string) => {
        // textboxに入力された文字列はmodelにstringとして格納されるため
        if (typeof v === 'string') {
          const _v = { text: v, color: 'green' }
          this.items.push(_v)
          return _v
        } else {
          return v
        }
      })
    }
  },

  methods: {
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
    },

    /* edit中のtagをセット */
    edit(index: number, item: Tag) {
      if (!this.editing.text) {
        this.editing = item
        this.index = index
      } else {
        this.editing = { text: '', color: '' }
        this.index = -1
      }
    }
  }
})
</script>
