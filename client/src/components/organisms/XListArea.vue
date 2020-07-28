<template>
  <v-container
    fluid
    class="x-list-area pa-1 ma-0"
    @click="$emit('list-area-click')"
  >
    <v-row>
      <v-col class="d-flex align-center justify-end flex-wrap">
        <!-- search field -->
        <v-combobox
          v-model="syncedFilter"
          :filter="filterTag"
          :hide-no-data="!search"
          :items="tagList"
          item-text="name"
          hide-selected
          label="enter keyword"
          prepend-inner-icon="mdi-magnify"
          multiple
          small-chips
          solo
          dense
          clearable
          hide-details
          class="mr-2"
          @blur="onBlur"
        >
          <template v-slot:prepend>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-if="isMobile"
                  icon
                  small
                  class="mr-1"
                  v-bind="attrs"
                  v-on="on"
                  @click.stop="$emit('menu-btn-click')"
                >
                  <v-icon>mdi-menu</v-icon>
                </v-btn>
              </template>
              <span>toggle sidebar</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  small
                  class="mr-1"
                  v-bind="attrs"
                  v-on="on"
                  @click="$emit('plus-btn-click')"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template>
              <span>create bookmark</span>
            </v-tooltip>
          </template>

          <!-- tag chip (deletable) -->
          <template v-slot:selection="{ attrs, item, parent, selected }">
            <v-chip
              v-if="item === Object(item)"
              v-bind="attrs"
              color="black--text amber lighten-3"
              :input-value="selected"
              label
              small
              :style="{ marginBottom: '2px' }"
            >
              <span class="pr-2">
                {{ item.name }}
              </span>
              <v-icon x-small @click="parent.selectItem(item)"
                >mdi-close</v-icon
              >
            </v-chip>

            <span v-if="typeof item === 'string'" class="pl-2">{{ item }}</span>
          </template>

          <!-- contents in pulldown menu -->
          <template v-slot:item="{ index, item }">
            <v-chip color="black--text amber lighten-3" label x-small>
              {{ item.name }}
            </v-chip>

            <v-spacer />
            <span class="caption grey--text text--lighten-1">
              {{ getLinkNumber(item) }} items
            </span>
          </template>

          <template v-slot:append-outer>
            <!-- display type -->
            <x-pulldown
              v-model="syncedDisplayType"
              items-type="object"
              :items="displayTypeItems"
              item-key="id"
              item-text-key="text"
              dense
              solo
              width="90px"
              hide-details
              class="mr-2"
            />
          </template>
        </v-combobox>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col>
        <slot></slot>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { PropType } from 'vue'
import { Component, Prop, PropSync, Vue } from 'vue-property-decorator'
import IBookmark from '@@/types/IBookmark'
import ITag from '@@/types/ITag'
import XPulldown from '../atoms/Pulldown.vue'
import IDisplayType from '../../../types/IDisplayType'
import { tagStore, bookmarkStore } from '@/store/index'
import displayTypes from '@/assets/displayTypes.json'

@Component({
  components: { XPulldown }
})
export default class XListArea extends Vue {
  displayTypeItems: IDisplayType[] = displayTypes
  search: string = ''

  @Prop({ type: Boolean, default: false })
  isMobile!: boolean

  @PropSync('filter', {
    type: Array as PropType<(string | ITag)[]>,
    default: () => []
  })
  syncedFilter!: (string | ITag)[]

  @PropSync('displayType', {
    type: Object as PropType<IDisplayType>,
    default: () => displayTypes[0]
  })
  syncedDisplayType!: IDisplayType

  get allBookmarks(): Array<IBookmark> {
    return bookmarkStore.allBookmarks
  }

  get tagList(): Array<ITag> {
    return tagStore.tagList
  }

  // input内のタグを文字列の前へ移動
  onBlur() {
    const list: Array<ITag | string> = []
    this.syncedFilter.forEach((d: ITag | string) => {
      if (typeof d === 'object') list.push(d)
    })
    this.syncedFilter.forEach((d: ITag | string) => {
      if (typeof d === 'string') list.push(d)
    })
    this.syncedFilter = list
  }

  filterTag(item: ITag, queryText: string = '', itemText: string = '') {
    // eslint-disable-next-line no-console
    console.log(item)

    return itemText
      .toString()
      .toLowerCase()
      .includes(queryText.toString().toLowerCase())
  }

  getLinkNumber(tag: ITag) {
    const list = this.allBookmarks.filter((b: IBookmark) =>
      b.tag.some((d: string) => d === tag._id)
    )
    return list.length
  }
}
</script>

<style>
.x-list-area .v-input__append-outer {
  padding: 0;
  margin: 0 3px !important;
}
</style>
