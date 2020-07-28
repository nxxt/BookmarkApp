<template>
  <v-container
    fluid
    class="darkest d-flex align-center justify-center fill-height"
  >
    <v-form @submit.prevent="loginUser">
      <v-card min-width="380px" class="darker pa-4">
        <v-card-title class="d-flex justify-center">
          Sign in
        </v-card-title>

        <v-card-text>
          <v-text-field
            v-model="user.email"
            prepend-icon="mdi-email-outline"
            label="E-mail"
            clearable
            dense
            background-color="darker"
            class="mb-4"
          />
          <v-text-field
            v-model="user.password"
            :type="showPassword ? 'text' : 'password'"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            prepend-icon="mdi-lock"
            label="Password"
            dense
            @click:append="showPassword = !showPassword"
          />
        </v-card-text>

        <v-card-actions class="px-5">
          <v-checkbox v-model="remember" label="Remember me"></v-checkbox>
          <v-spacer />
          <v-btn type="submit" class="primary">login</v-btn>
        </v-card-actions>

        <v-card-text class="d-flex justify-end">
          <nuxt-link class="link" to="/register">register user →</nuxt-link>
        </v-card-text>
      </v-card>
    </v-form>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({})
export default class Login extends Vue {
  remember: boolean = true
  showPassword: boolean = false
  user: { email: string; password: string } = {
    email: '',
    password: ''
  }

  async loginUser() {
    if (!this.remember) (this.$auth as any).options.localStorage = false
    const res: any = await this.$auth.loginWith('local', { data: this.user })
    if (res.status === 200) this.$router.push('/bookmarks/h-0')
  }
}
</script>

<style scoped>
.link {
  text-decoration: none;
  color: whitesmoke;
}
.link:hover {
  color: #1976d2;
}
</style>
