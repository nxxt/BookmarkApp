<template>
  <div class="x-domain-text d-flex align-center">
    <v-icon class="mr-1" x-small>mdi-domain</v-icon>
    <span>{{ text }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class XDomainText extends Vue {
  @Prop({ type: String, default: 'domain' })
  text!: string
}
</script>
