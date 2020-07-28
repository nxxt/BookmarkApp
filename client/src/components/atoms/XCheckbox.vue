<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-simple-checkbox
        class="x-checkbox"
        :value="isChecked"
        v-bind="attrs"
        :ripple="false"
        @input="onInput"
        v-on="on"
      />
    </template>
    <span>to md</span>
  </v-tooltip>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class XCheckbox extends Vue {
  isChecked: boolean = false

  onInput() {
    this.isChecked = !this.isChecked
    this.$emit('input', this.isChecked)
  }

  setCheck(val: boolean) {
    this.isChecked = val
  }
}
</script>
