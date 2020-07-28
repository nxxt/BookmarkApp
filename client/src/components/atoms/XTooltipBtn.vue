<template>
  <v-tooltip bottom>
    <!-- btn -->
    <template v-slot:activator="{ on }">
      <div v-on="on">
        <v-btn
          class="x-tooltip-btn"
          :class="classes"
          v-bind="$attrs"
          v-on="listeners"
        >
          <slot></slot>
        </v-btn>
      </div>
    </template>

    <!-- tooltip content -->
    <span>{{ tooltip }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import { PropType } from 'vue'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  inheritAttrs: false
})
export default class XTooltipBtn extends Vue {
  @Prop({ type: [String, Number], default: 'tooltip' })
  tooltip!: string | number

  @Prop({ type: Array as PropType<String[]>, default: () => [] })
  classes!: string[]

  get listeners() {
    const vm = this
    return {
      ...vm.$listeners,
      click: (event: Event) => vm.$emit('click', event)
    }
  }
}
</script>
