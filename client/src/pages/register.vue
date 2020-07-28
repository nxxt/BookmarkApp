<template>
  <v-container
    fluid
    class="darkest d-flex align-center justify-center fill-height"
  >
    <v-form @submit.prevent="registerUser">
      <v-card min-width="380px" class="darker pa-4">
        <v-card-title class="d-flex justify-center">
          Register User
        </v-card-title>

        <v-card-text>
          <v-text-field
            v-model="user.firstName"
            prepend-icon="mdi-tag-text-outline"
            label="First name"
            clearable
            dense
            background-color="darker"
            class="mb-4"
          />
          <v-text-field
            v-model="user.lastName"
            prepend-icon="mdi-tag-text-outline"
            label="Last name"
            clearable
            dense
            background-color="darker"
            class="mb-4"
          />
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
          <v-spacer />
          <v-btn type="submit" class="primary">register</v-btn>
        </v-card-actions>

        <v-card-text>
          <nuxt-link class="link" to="/">← top</nuxt-link>
        </v-card-text>
      </v-card>
    </v-form>

    <v-snackbar v-model="snackbar" color="grey darken-4" :timeout="timeout">
      {{ snackbarText }}
      <v-btn color="primary" small icon text @click="snackbar = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
type User = {
  firstName: string | number
  lastName: string | number
  email: string
  password: string | number
  role: number
}

@Component({ auth: false })
export default class Login extends Vue {
  showPassword: boolean = false
  user: User = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 0
  }

  // error
  snackbar: boolean = false
  snackbarText: string = ''
  timeout: number = 2000

  async registerUser() {
    try {
      await this.$axios.$post('/api/v1/auth/register', this.user)
      const res: any = await this.$auth.loginWith('local', { data: this.user })
      if (res.status === 200) this.$router.push('/bookmarks/h-0')
    } catch (err) {
      this.snack(err.message || 'ユーザー作成に失敗しました。')
    }
  }

  snack(text: string) {
    this.snackbarText = text
    this.snackbar = true
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
