<template>
  <span>{{ text | textOverflow }}</span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class XMemo extends Vue {
  @Prop({ type: String, default: 'memo' })
  text!: string
}
</script>
