<template>
  <v-card
    :color="color"
    class="x-create-form"
    :style="{ width: `${isMobile ? '100%' : '90%'}` }"
  >
    <v-card-title>Create Bookmark</v-card-title>

    <v-card-text class="pt-6">
      <v-form ref="form" v-model="valid" lazy-validation>
        <h4>URL</h4>
        <v-text-field
          v-model="url"
          placeholder="Insert a link URL to any page."
          :rules="[isUrl]"
          validate-on-blur
        />
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <x-tooltip-btn
        tooltip="save page"
        :disabled="url === '' || !valid"
        @click="onBtnClick"
      >
        save
      </x-tooltip-btn>
    </v-card-actions>

    <v-card-text class="d-flex justify-center">
      <!-- slot for progress circular -->
      <slot></slot>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import XTooltipBtn from '@/components/atoms/XTooltipBtn.vue'

@Component({
  components: { XTooltipBtn }
})
export default class XCreateForm extends Vue {
  url: string = ''
  valid: boolean = false

  @Prop({ type: Boolean, default: false })
  isMobile!: boolean

  @Prop({ type: String, default: '' })
  color!: string

  onBtnClick() {
    const form = this.$refs.form as any
    if (form && form.validate()) {
      this.$emit('url-save-btn-click', this.url)
    }
  }

  isUrl(str: string) {
    if (str === '') return 'url is empty'
    const regex = new RegExp(
      "((https?|ftp)(://[-_.!~*'()a-zA-Z0-9;/?:@&=+$,%#]+))"
    )
    return regex.test(str) || 'invalid url'
  }
}
</script>
