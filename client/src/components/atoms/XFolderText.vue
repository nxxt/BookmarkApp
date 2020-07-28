<template>
  <div class="x-folder-text d-flex align-center">
    <v-icon class="mr-1" x-small>mdi-folder</v-icon>
    <span
      v-for="(item, i) in folders"
      :key="item._id"
      :class="{ 'mr-1': i !== folders.length - 1 }"
      @click="$emit('click', item._id)"
    >
      {{ `${item.name}${i === items.length - 1 ? '' : ','}` }}
    </span>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue'
import { Component, Prop, Vue } from 'vue-property-decorator'
import IFolder from '@@/types/IFolder'

@Component
export default class XFolderText extends Vue {
  @Prop({ type: Array as PropType<String[]>, default: () => [] })
  items!: string[]

  get folders(): IFolder[] {
    return this.items
      .map((id) => this.$getFolderById(id))
      .sort((a, b) => (a.name > b.name ? 1 : -1))
  }
}
</script>
