<template>
  <div class="x-date-text d-flex align-center">
    <v-icon class="mr-1" x-small>mdi-calendar-text</v-icon>
    <span> {{ text | dateFormat }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class XDateText extends Vue {
  @Prop({ type: String, default: 'date' })
  text!: string
}
</script>
