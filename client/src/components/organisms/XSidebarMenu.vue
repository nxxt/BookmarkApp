<template>
  <div
    class="pa-0 ma-0 fill-height"
    :style="{ position: 'relative', width: '100%' }"
  >
    <v-list dense :class="color">
      <v-list-item
        v-for="(item, i) in headers"
        :key="`key${i}`"
        dense
        class="py-0"
        @click="onSidebarMenuClick(item)"
      >
        <v-list-item-avatar class="my-0">
          <v-icon v-text="item.icon"></v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title class="caption" v-text="item.text" />
        </v-list-item-content>

        <v-list-item-action class="my-0">
          <v-chip small>{{ item.number }}</v-chip>
        </v-list-item-action>
      </v-list-item>
    </v-list>
    <v-divider />

    <v-list dense subheader :class="color">
      <v-subheader>
        My Folders

        <v-spacer />
        <v-btn
          v-if="menu2"
          class="mr-2"
          icon
          x-small
          @click.stop="folderEditArea = !folderEditArea"
        >
          <v-icon>mdi-folder-plus-outline</v-icon>
        </v-btn>

        <v-btn icon x-small @click.stop="menu2 = !menu2">
          <v-icon>{{ menu2 ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
        </v-btn>
      </v-subheader>

      <template v-if="menu2">
        <v-text-field
          v-if="folderEditArea"
          v-model="folderName"
          dense
          class="mx-4"
          hide-details
          outlined
          placeholder="Create Collection"
          append-outer-icon="mdi-plus"
          @click:append-outer="onCreateFolderBtnClick"
          @keydown="onCreateFolderEnterKeydown"
        />

        <template v-for="item in folders">
          <v-hover v-slot:default="{ hover }" :key="item._id">
            <v-list-item
              :key="`item_${item._id}`"
              dense
              class="py-0"
              :style="{ position: 'relative' }"
              @drop="onBookmarkDropped($event, item)"
              @dragover.prevent
              @dragenter.prevent
              @click="onSidebarMenuClick(item)"
            >
              <v-list-item-avatar class="my-0">
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title class="caption" v-text="item.text" />
              </v-list-item-content>

              <v-list-item-action v-if="!hover" class="my-0">
                <v-chip small>{{ item.number }}</v-chip>
              </v-list-item-action>

              <div
                v-if="hover"
                :style="{
                  position: 'absolute',
                  right: 0,
                  zIndex: 10,
                  width: '100px'
                }"
                class="d-flex justify-end pr-4"
              >
                <v-btn
                  icon
                  x-small
                  class="mr-2"
                  @click.stop="$emit('folder-edit-btn-click', item)"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>

                <v-btn
                  icon
                  x-small
                  @click.stop="$emit('folder-delete-btn-click', item._id)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </div>
            </v-list-item>
          </v-hover>
        </template>
      </template>
    </v-list>
    <v-divider />

    <v-list dense subheader :class="color">
      <v-subheader @click="menu3 = !menu3">
        Maintenance

        <v-spacer />
        <v-btn icon x-small @click.stop="menu3 = !menu3">
          <v-icon>{{ menu3 ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
        </v-btn>
      </v-subheader>

      <template v-if="menu3">
        <v-list-item
          v-for="(item, i) in maintenances"
          :key="`key${i}`"
          dense
          class="py-0"
          @click="onSidebarMenuClick(item)"
        >
          <v-list-item-avatar class="my-0">
            <v-icon v-text="item.icon"></v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title class="caption" v-text="item.text" />
          </v-list-item-content>

          <v-list-item-action class="my-0">
            <v-chip small>{{ item.number }}</v-chip>
          </v-list-item-action>
        </v-list-item>
      </template>
    </v-list>
    <v-divider />

    <v-list
      dense
      :style="{ width: '100%', position: 'absolute', bottom: 0 }"
      :class="color"
    >
      <v-list-item
        v-if="$auth.loggedIn"
        :key="'login'"
        :class="$style.app_logout"
        dense
        @click="logout"
      >
        <v-list-item-avatar class="my-0">
          <v-icon>mdi-logout</v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title class="caption">
            logout
          </v-list-item-title>
        </v-list-item-content>

        <v-list-item-action class="my-0"> </v-list-item-action>
      </v-list-item>
    </v-list>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue'
import { Component, Prop, Vue } from 'vue-property-decorator'
import ISidebarMenu from '@@/types/ISidebarMenu'

@Component({})
export default class XListGroup extends Vue {
  menu1: boolean = true
  menu2: boolean = true
  menu3: boolean = true
  folderName: string = ''
  folderEditArea: boolean = false

  @Prop({ type: Array as PropType<ISidebarMenu[]>, default: () => [] })
  headers!: ISidebarMenu[]

  @Prop({ type: Array as PropType<ISidebarMenu[]>, default: () => [] })
  folders!: ISidebarMenu[]

  @Prop({ type: Array as PropType<ISidebarMenu[]>, default: () => [] })
  maintenances!: ISidebarMenu[]

  @Prop({ type: String, default: '' })
  color!: string

  onSidebarMenuClick(item: ISidebarMenu) {
    this.$emit('sidebar-menu-click', item)
  }

  onBookmarkDropped(event: DragEvent, item: ISidebarMenu) {
    if (event.dataTransfer) {
      const bookmarkId = event.dataTransfer.getData('bookmarkId')
      this.$emit('bookmark-drop', bookmarkId, item)
    }
  }

  onCreateFolderBtnClick() {
    this.$emit('create-folder-btn-click', this.folderName)
    this.folderName = ''
  }

  onCreateFolderEnterKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && event.keyCode === 13) {
      this.$emit('create-folder-btn-click', this.folderName)
      this.folderName = ''
    }
  }

  logout() {
    this.$auth.logout().then(() => this.$router.push('/login'))
  }
}
</script>

<style module>
.app_logout:hover {
  background: rgb(46, 46, 46);
  cursor: pointer;
}
</style>
