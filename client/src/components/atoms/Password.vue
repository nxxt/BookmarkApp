<template>
  <v-text-field
    v-model="password"
    :type="showPassword ? 'text' : 'password'"
    :label="label"
    :disabled="disabled"
    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
    :dense="dense"
    :rules="rules"
    prepend-icon="mdi-lock"
    @click:append="showPassword = !showPassword"
    @blur="onBlur"
  />
</template>

<script>
export default {
  props: {
    value: { type: [String, Number], default: '' },
    label: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    dense: { type: Boolean, default: false },
    rules: { type: Array, default: () => [] }
  },
  data() {
    return {
      password: '',
      showPassword: false
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.password = val
      }
    }
  },
  methods: {
    onBlur() {
      this.$emit('input', this.password)
    }
  }
}
</script>
