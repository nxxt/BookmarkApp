<template>
  <div class="x-list-item-title d-flex align-center">
    <x-tooltip-chip
      label
      x-small
      :classes="{
        'body-2': true,
        'mr-2': true,
        'white--text': true,
        'font-weight-bold': true
      }"
      :style="{ width: '100px' }"
      :color="$getColorByNumber(number)"
      tooltip="watch#"
    >
      {{ number }}
    </x-tooltip-chip>

    <a
      :class="$style.list_item_title_text"
      class="white--text"
      :title="url"
      :href="url"
      target="_blank"
      @click.stop="$emit('click', _id)"
    >
      {{ text }}
    </a>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import XTooltipChip from '@/components/atoms/XTooltipChip.vue'

@Component({
  components: { XTooltipChip }
})
export default class XListItemTitle extends Vue {
  // objectId
  @Prop({ type: String, default: '_id' })
  _id!: string

  // watchNumber
  @Prop({ type: Number, default: 0 })
  number!: number

  // title
  @Prop({ type: String, default: 'title' })
  text!: string

  // url
  @Prop({ type: String, default: 'url' })
  url!: string
}
</script>

<style module>
.list_item_title_text {
  text-decoration: none;
}
</style>
