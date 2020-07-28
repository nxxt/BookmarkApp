<template>
  <v-text-field
    v-bind="$attrs"
    :value="value"
    :dense="dense"
    :style="{ width }"
    :hide-details="hideDetails"
    v-on="listeners"
  />
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  inheritAttrs: false,
  props: {
    value: { type: [String, Number, Object], default: '' },
    width: { type: [String, Number], default: 'auto' },
    dense: { type: Boolean, default: true },
    hideDetails: { type: Boolean, default: false }
  },
  computed: {
    listeners() {
      const vm = this
      return {
        ...vm.$listeners,
        input: (event: Event) => vm.$emit('input', event)
      }
    }
  }
})
</script>
