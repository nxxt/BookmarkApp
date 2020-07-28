<template>
  <div class="x-hashtag d-flex align-center">
    <v-chip
      v-for="_id in items"
      :key="_id"
      class="pa-1 darker amber--text text--lighten-3"
      label
      small
      @click="$emit('click', _id)"
    >
      {{ $getTagById(_id) | tagName }}
    </v-chip>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class XHashtag extends Vue {
  @Prop({ type: Array as PropType<String[]>, default: [] })
  items!: string[]
}
</script>
