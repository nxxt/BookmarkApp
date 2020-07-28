<template>
  <v-app class="darkest">
    <v-container class="darkest d-flex align-center justify-center">
      <v-card class="darker frame">
        <v-card-title class="d-flex justify-center">
          <h1 class="error-title">{{ error.statusCode }}</h1>
        </v-card-title>
        <v-card-text class="py-4">
          <p v-if="error.statusCode === 404" class="error-text">
            {{ error.message }}
          </p>
          <p v-else-if="error.statusCode === 403" class="error-text">
            {{ error.message }}
          </p>
          <p v-else class="error-text">
            {{ otherError }}
          </p>
        </v-card-text>
        <v-card-actions class="d-flex justify-center">
          <NuxtLink to="/" class="error-link">
            ← Home page
          </NuxtLink>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-app>
</template>

<script lang="ts">
import { PropType } from 'vue'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  layout: 'empty'
})
export default class XListArea extends Vue {
  pageNotFound: string = 'Not Found'
  otherError: string = 'An error occurred'

  @Prop({
    type: Object as PropType<Error & { statusCode: number }>,
    default: null
  })
  error!: Error & { statusCode: number }

  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  }
}
</script>

<style scoped>
.frame {
  width: 350px;
  text-align: center;
  padding: 40px;
}
.error-title {
  color: #888;
  font-size: 70px;
  font-weight: Bold;
}
</style>
