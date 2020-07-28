<template>
  <v-text-field
    v-bind="$attrs"
    :value="value"
    :style="{ width }"
    :dense="dense"
    :flat="flat"
    :solo="solo"
    :hide-details="hideDetails"
    class="update-field"
    v-on="listeners"
  />
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    value: { type: [String, Number], default: '' },
    width: { type: [String, Number], default: 'auto' },
    dense: { type: Boolean, default: true },
    flat: { type: Boolean, default: true },
    solo: { type: Boolean, default: true },
    hideDetails: { type: Boolean, default: true }
  },
  computed: {
    listeners() {
      const vm = this
      return {
        ...vm.$listeners,
        input: (event) => vm.$emit('input', event),
        click: (event) => vm.$emit('click', event),
        change: (event) => vm.$emit('change', event)
      }
    }
  }
}
</script>

<style scoped>
.update-field > .v-input_control > .v-input__slot {
  padding: 0 !important;
}
</style>
