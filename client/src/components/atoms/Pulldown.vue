<template>
  <div>
    <v-select
      v-if="itemsType === 'object'"
      v-bind="$attrs"
      :value="value"
      :items="items"
      :item-text="items[itemTextKey]"
      :item-key="itemKey"
      :style="{ width }"
      :dense="dense"
      return-object
      v-on="listeners"
    />
    <v-select
      v-if="itemsType === 'array'"
      v-bind="$attrs"
      :value="value"
      :items="items"
      :style="{ width }"
      :dense="dense"
      v-on="listeners"
    />
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  model: { props: 'value', event: 'change' },
  props: {
    value: { type: [String, Number, Object], default: '' },
    dense: { type: Boolean, default: true },
    items: { type: [Object, Array], default: () => ({}) },
    itemsType: { type: String, default: 'object' },
    itemTextKey: { type: String, default: '' },
    itemKey: { type: String, default: '' },
    width: { type: [String, Number], default: 'auto' }
  },
  computed: {
    listeners() {
      const vm = this
      return {
        ...vm.$listeners,
        change: (event) => vm.$emit('change', event)
      }
    }
  }
}
</script>
