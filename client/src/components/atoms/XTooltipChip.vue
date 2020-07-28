<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <div
        class="x-tooltip-chip px-2"
        :class="{ ...classes, [color]: true }"
        :style="{ borderRadius: '5px' }"
        v-on="on"
      >
        <slot></slot>
      </div>
    </template>

    <!-- tooltip content -->
    <span>{{ tooltip }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({})
export default class XTooltipChip extends Vue {
  @Prop({ type: [String, Number], default: 'tooltip' })
  tooltip!: string | number

  @Prop({ type: Object, default: () => ({}) })
  classes!: { [key: string]: boolean }

  @Prop({ type: [String, Number], default: 'blue' })
  color!: string | number

  onDuplicateTagName() {
    this.$emit('duplicate-tag-name')
  }
}
</script>
