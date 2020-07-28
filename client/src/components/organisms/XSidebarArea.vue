<template>
  <div class="x-sidebar-area">
    <v-list-item class="px-1" dense>
      <v-list-item-content>
        <v-list-item-title
          class="mt-2 d-flex align-center justify-space-between"
        >
          <div class="title d-flex align-center">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-if="isMobile"
                  icon
                  small
                  v-bind="attrs"
                  v-on="on"
                  @click.stop="$emit('menu-btn-click')"
                >
                  <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
              </template>
              <span>toggle sidebar</span>
            </v-tooltip>

            <a
              :class="$style.sidebar_title"
              class="d-flex align-center pl-1 pr-3 py-0 white--text"
              href=""
            >
              <v-icon>mdi-bookmark-plus</v-icon> BOOKMARKS
            </a>
          </div>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-if="isMobile"
                small
                v-bind="attrs"
                icon
                v-on="on"
                @click="$emit('plus-btn-click')"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <span>create bookmark</span>
          </v-tooltip>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-divider />

    <div class="scroll d-flex flex-column justify-space-between">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class XSidebarArea extends Vue {
  @Prop({ type: Boolean, default: false })
  isMobile!: boolean
}
</script>

<style module>
.sidebar_title {
  text-decoration: none;
}
</style>
