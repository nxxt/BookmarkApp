<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        id="download"
        small
        v-bind="attrs"
        icon
        v-on="on"
        @click="$emit('click')"
      >
        <v-icon>mdi-download</v-icon>
      </v-btn>
    </template>
    <span>download md</span>
  </v-tooltip>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class XDownloadBtn extends Vue {}
</script>
