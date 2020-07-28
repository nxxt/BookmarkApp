<template>
  <v-container fluid class="pa-1 ma-0" @click="$emit('edit-area-click')">
    <v-row>
      <v-col class="d-flex align-center">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-if="isMobile"
              icon
              small
              class="mr-1 x-edit-area-menu-btn"
              v-bind="attrs"
              v-on="on"
              @click.stop="$emit('menu-btn-click')"
            >
              <v-icon>mdi-menu</v-icon>
            </v-btn>
          </template>
          <span>toggle sidebar</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="x-edit-area-arrow-left-btn"
              small
              v-bind="attrs"
              icon
              v-on="on"
              @click="$emit('arrow-left-btn-click')"
            >
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
          </template>
          <span>back to</span>
        </v-tooltip>
      </v-col>
    </v-row>

    <v-row class="scroll">
      <v-col class="d-flex justify-center">
        <slot></slot>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({})
export default class XEditArea extends Vue {
  @Prop({ type: Boolean, default: false })
  isMobile!: boolean
}
</script>
