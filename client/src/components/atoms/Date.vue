<template>
  <div :style="{ width }">
    <v-menu
      v-model="datepicker"
      :close-on-content-click="false"
      :nudge-right="0"
      transition="scale-transition"
      lazy
      offset-y
      min-width="290px"
    >
      <template v-slot:activator="{ on }">
        <v-text-field
          :value="date | dateFormat"
          :label="label"
          :disabled="disabled"
          :outlined="outlined"
          :dense="dense"
          :style="{ width }"
          :height="height"
          :hide-details="hideDetails"
          readonly
          @input="(value) => (date = value)"
          v-on="on"
          @blur="onBlur()"
        />
      </template>

      <v-date-picker
        v-model="date"
        :type="pickerType"
        scrollable
        no-title
        @input="datepicker = false"
        @change="onChange()"
      />
      <v-btn @click="onClear">clear</v-btn>
    </v-menu>
  </div>
</template>

<script>
export default {
  props: {
    value: { type: [String, Number], default: '' },
    label: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    pickerType: { type: String, default: 'date' },
    outlined: { type: Boolean, default: true },
    width: { type: [String, Number], default: 'auto' },
    height: { type: [String, Number], default: 'auto' },
    dense: { type: Boolean, default: true },
    placeholder: { type: [String, Number], default: '' },
    hideDetails: { type: Boolean, default: true }
  },
  data() {
    return {
      date: null,
      datepicker: false
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.date = val
      }
    }
  },
  methods: {
    onBlur() {
      this.emitNewValue()
    },
    onChange() {
      this.emitNewValue()
      this.datepicker = false
    },
    emitNewValue() {
      this.$emit('input', this.date)
    },
    onClear() {
      this.date = null
      this.datepicker = false
    }
  }
}
</script>
